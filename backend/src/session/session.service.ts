import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Lobby, LobbyStatus, Player } from './lobby.entity';
import { CreateLobbyDto, JoinLobbyDto } from './session.dto';
import { QuizService } from '../quizs/quiz.service';

@Injectable()
export class SessionService {
    private lobbies: Map<string, Lobby> = new Map();
    private socketToLobby: Map<string, string> = new Map();

    constructor(private readonly quizService: QuizService) {}

    async createLobby(dto: CreateLobbyDto, socketId: string): Promise<Lobby> {
        const quiz = await this.quizService.quizGetById(parseInt(dto.quizId));
        if (!quiz) {
            throw new NotFoundException(`Квиз с ID ${dto.quizId} не найден`);
        }

        const lobbyId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const questions = await this.quizService.getQuestions(parseInt(dto.quizId));

        const newLobby: Lobby = {
            id: lobbyId,
            code: lobbyId,
            quizId: dto.quizId,
            quizName: quiz.name,
            hostId: socketId,
            status: LobbyStatus.WAITING,
            currentQuestionIndex: 0,
            questions: this.shuffleArray(questions),
            answers: {},
            createdAt: Date.now(),
            players: [{
                id: socketId,
                name: dto.playerName,
                score: 0,
                isHost: true,
                socketId
            }],
        };

        this.lobbies.set(lobbyId, newLobby);
        this.socketToLobby.set(socketId, lobbyId);
        return this.serializeLobby(newLobby);
    }

    joinLobby(dto: JoinLobbyDto, socketId: string): Lobby {
        const lobby = Array.from(this.lobbies.values()).find(
            (l) => l.code === dto.lobbyId || l.id === dto.lobbyId
        );

        if (!lobby) {
            throw new NotFoundException('Лобби не найдено');
        }
        if (lobby.status !== LobbyStatus.WAITING) {
            throw new BadRequestException('Игра уже началась');
        }

        lobby.players.push({
            id: socketId,
            name: dto.playerName,
            score: 0,
            isHost: false,
            socketId
        });

        this.socketToLobby.set(socketId, lobby.id);
        this.lobbies.set(lobby.id, lobby);
        return this.serializeLobby(lobby);
    }

    async startGame(lobbyId: string, socketId: string): Promise<{ lobby: Lobby; totalQuestions: number }> {
        const lobby = this.lobbies.get(lobbyId);
        if (!lobby) {
            throw new NotFoundException('Лобби не найдено');
        }
        if (lobby.hostId !== socketId) {
            throw new BadRequestException('Только хост может начать игру');
        }

        lobby.status = LobbyStatus.PLAYING;
        lobby.currentQuestionIndex = 0;
        lobby.answers = {};

        if (!lobby.questions || lobby.questions.length === 0) {
            const questions = await this.quizService.getQuestions(parseInt(lobby.quizId));
            lobby.questions = this.shuffleArray(questions);
        }

        this.lobbies.set(lobbyId, lobby);

        return {
            lobby: this.serializeLobby(lobby),
            totalQuestions: lobby.questions.length,
        };
    }

    async submitAnswer(socketId: string, answer: string): Promise<{ lobbyId: string; allAnswered: boolean } | null> {
        const lobbyId = this.socketToLobby.get(socketId);
        if (!lobbyId) {
            return null;
        }

        const lobby = this.lobbies.get(lobbyId);
        if (!lobby || lobby.status !== LobbyStatus.PLAYING) {
            return null;
        }

        lobby.answers[socketId] = answer;
        this.lobbies.set(lobbyId, lobby);

        const answeredCount = Object.keys(lobby.answers).length;
        const totalPlayers = lobby.players.length;
        const allAnswered = answeredCount >= totalPlayers;


        return { lobbyId, allAnswered };
    }

    async getNextQuestion(lobbyId: string): Promise<{ question: any; index: number } | null> {
        const lobby = this.lobbies.get(lobbyId);
        if (!lobby) {
            return null;
        }

        if (lobby.currentQuestionIndex >= lobby.questions.length) {
            return null;
        }

        lobby.answers = {};
        const question = lobby.questions[lobby.currentQuestionIndex];


        return {
            question: {
                id: question.id,
                ques: question.question,
                correct_answer: question.correct_answer,  // <-- ДОБАВИЛ
                incorrect_answers: question.incorrect_answers,
                quizId: question.quizId,
            },
            index: lobby.currentQuestionIndex,
        };
    }

    async processRound(lobbyId: string): Promise<{ correctAnswer: string; leaderboard: any[] } | null> {
        const lobby = this.lobbies.get(lobbyId);
        if (!lobby) {
            return null;
        }

        const currentQuestion = lobby.questions[lobby.currentQuestionIndex];
        const correctAnswer = currentQuestion.correct_answer;


        lobby.players.forEach((player) => {
            const playerAnswer = lobby.answers[player.socketId];
            const isCorrect = playerAnswer === correctAnswer;
            if (isCorrect) {
                player.score += 10;
            }
        });

        lobby.currentQuestionIndex++;

        const leaderboard = this.getLeaderboard(lobby);

        return {
            correctAnswer,
            leaderboard,
        };
    }

    async endGame(lobbyId: string): Promise<{ leaderboard: any[] } | null> {
        const lobby = this.lobbies.get(lobbyId);
        if (!lobby) {
            return null;
        }

        lobby.status = LobbyStatus.FINISHED;
        const leaderboard = this.getLeaderboard(lobby);

        return { leaderboard };
    }

    cleanupLobby(lobbyId: string): void {
        const lobby = this.lobbies.get(lobbyId);
        if (lobby) {
            lobby.players.forEach((p) => this.socketToLobby.delete(p.socketId));
            this.lobbies.delete(lobbyId);
        }
    }

    removePlayer(socketId: string): { lobbyId: string | null; isHost: boolean } {
        const lobbyId = this.socketToLobby.get(socketId);
        if (!lobbyId) return { lobbyId: null, isHost: false };

        const lobby = this.lobbies.get(lobbyId);
        if (!lobby) return { lobbyId: null, isHost: false };

        const playerIndex = lobby.players.findIndex((p) => p.socketId === socketId);
        if (playerIndex === -1) return { lobbyId: null, isHost: false };

        const isHost = lobby.hostId === socketId;
        lobby.players.splice(playerIndex, 1);
        this.socketToLobby.delete(socketId);

        if (lobby.players.length === 0 || isHost) {
            this.cleanupLobby(lobbyId);
            return { lobbyId, isHost: true };
        }

        this.lobbies.set(lobbyId, lobby);
        return { lobbyId, isHost: false };
    }

    getLobby(lobbyId: string): Lobby | undefined {
        const lobby = this.lobbies.get(lobbyId);
        return lobby ? this.serializeLobby(lobby) : undefined;
    }

    private getLeaderboard(lobby: Lobby): Array<{ name: string; score: number }> {
        return [...lobby.players]
            .sort((a, b) => b.score - a.score)
            .map((p) => ({ name: p.name, score: p.score }));
    }

    private serializeLobby(lobby: Lobby): Lobby {
        return {
            ...lobby,
            players: lobby.players.map((p) => ({
                id: p.id,
                name: p.name,
                score: p.score,
                isHost: p.isHost,
                socketId: p.socketId,
            })),
        };
    }

    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}