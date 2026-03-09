import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Lobby, LobbyStatus } from './lobby.entity';
import { CreateLobbyDto, JoinLobbyDto } from './session.dto';
import { QuizService } from '../quizs/quiz.service';

@Injectable()
export class SessionService {
    private lobbies: Map<string, Lobby> = new Map();

    constructor(private readonly quizService: QuizService) {}

    async createLobby(dto: CreateLobbyDto, socketId: string): Promise<Lobby> {
        const quiz = await this.quizService.quizGetById(parseInt(dto.quizId));
        if (!quiz) {
            throw new NotFoundException(`Квиз с ID ${dto.quizId} не найден`);
        }

        const lobbyId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newLobby: Lobby = {
            id: lobbyId,
            quizId: dto.quizId,
            hostId: socketId,
            status: LobbyStatus.WAITING,
            currentQuestionIndex: 0,
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
        return newLobby;
    }

    joinLobby(dto: JoinLobbyDto, socketId: string): Lobby {
        const lobby = this.lobbies.get(dto.lobbyId);
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
        this.lobbies.set(dto.lobbyId, lobby);
        return lobby;
    }

    startGame(lobbyId: string, socketId: string): Lobby {
        const lobby = this.lobbies.get(lobbyId);
        if (!lobby) {
            throw new NotFoundException('Лобби не найдено');
        }
        if (lobby.hostId !== socketId) {
            throw new BadRequestException('Только хост может начать игру');
        }

        lobby.status = LobbyStatus.PLAYING;
        this.lobbies.set(lobbyId, lobby);
        return lobby;
    }

    submitAnswer(lobbyId: string, playerId: string, questionIndex: number, answerIndex: number): Lobby | null {
        const lobby = this.lobbies.get(lobbyId);
        if (!lobby || lobby.status !== LobbyStatus.PLAYING) {
            return null;
        }

        lobby.answers[playerId] = answerIndex;
        this.lobbies.set(lobbyId, lobby);
        return lobby;
    }

    getLobby(lobbyId: string): Lobby | undefined {
        return this.lobbies.get(lobbyId);
    }

    removePlayer(socketId: string): { lobbyId: string | null; isHost: boolean } {
        for (const [lobbyId, lobby] of this.lobbies.entries()) {
            const playerIndex = lobby.players.findIndex(p => p.socketId === socketId);
            if (playerIndex !== -1) {
                const isHost = lobby.hostId === socketId;
                lobby.players.splice(playerIndex, 1);

                if (isHost) {
                    this.lobbies.delete(lobbyId);
                    return { lobbyId, isHost: true };
                }

                this.lobbies.set(lobbyId, lobby);
                return { lobbyId, isHost: false };
            }
        }
        return { lobbyId: null, isHost: false };
    }
}