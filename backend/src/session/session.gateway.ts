import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionService } from './session.service';
import { CreateLobbyDto, JoinLobbyDto, StartGameDto } from './session.dto';
import { UsePipes, ValidationPipe, Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: 'sessions',
})
export class SessionGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    private logger = new Logger('SessionGateway');

    constructor(private readonly sessionService: SessionService) {}

    @SubscribeMessage('create_lobby')
    @UsePipes(new ValidationPipe())
    async handleCreateLobby(
        @MessageBody() dto: CreateLobbyDto,
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const lobby = await this.sessionService.createLobby(dto, client.id);
            client.join(lobby.id);
            client.emit('lobby_created', lobby);
            this.logger.log(`Lobby created: ${lobby.id} by ${dto.playerName}`);
        } catch (error) {
            client.emit('error', { message: error.message });
        }
    }

    @SubscribeMessage('join_lobby')
    @UsePipes(new ValidationPipe())
    handleJoinLobby(
        @MessageBody() dto: JoinLobbyDto,
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const lobby = this.sessionService.joinLobby(dto, client.id);
            client.join(lobby.id);
            this.server.to(lobby.id).emit('lobby_updated', lobby);
            this.logger.log(`Player ${dto.playerName} joined lobby: ${lobby.id}`);
        } catch (error) {
            client.emit('error', { message: error.message });
        }
    }

    @SubscribeMessage('start_game')
    @UsePipes(new ValidationPipe())
    async handleStartGame(
        @MessageBody() dto: StartGameDto,
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const result = await this.sessionService.startGame(dto.lobbyId, client.id);

            this.server.to(result.lobby.id).emit('game_started', {
                lobbyId: result.lobby.id,
                quizId: result.lobby.quizId,
                status: result.lobby.status,
                players: result.lobby.players,
                totalQuestions: result.totalQuestions,
            });

            setTimeout(() => {
                this.sendQuestion(result.lobby.id);
            }, 2000);

            this.logger.log(`Game started in lobby: ${result.lobby.id}`);
        } catch (error) {
            client.emit('error', { message: error.message });
        }
    }

    @SubscribeMessage('game_answer')
    @UsePipes(new ValidationPipe())
    async handleGameAnswer(
        @MessageBody() dto: { answer: string },
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const result = await this.sessionService.submitAnswer(client.id, dto.answer);

            if (result?.allAnswered) {
                await this.processRound(result.lobbyId);
            }
        } catch (error) {
            client.emit('error', { message: error.message });
        }
    }

    @SubscribeMessage('leave_lobby')
    handleLeaveLobby(@ConnectedSocket() client: Socket) {
        const result = this.sessionService.removePlayer(client.id);
        if (result?.lobbyId) {
            if (result.isHost) {
                this.server.to(result.lobbyId).emit('lobby_closed', { reason: 'Хост покинул игру' });
            } else {
                const lobby = this.sessionService.getLobby(result.lobbyId);
                if (lobby) {
                    this.server.to(result.lobbyId).emit('lobby_updated', lobby);
                }
            }
        }
    }

    handleDisconnect(client: Socket) {
        const result = this.sessionService.removePlayer(client.id);
        if (result?.lobbyId) {
            if (result.isHost) {
                this.server.to(result.lobbyId).emit('lobby_closed', { reason: 'Хост отключился' });
            } else {
                const lobby = this.sessionService.getLobby(result.lobbyId);
                if (lobby) {
                    this.server.to(result.lobbyId).emit('lobby_updated', lobby);
                }
            }
        }
    }

    private async sendQuestion(lobbyId: string) {
        try {
            const result = await this.sessionService.getNextQuestion(lobbyId);

            if (!result) {
                this.endGame(lobbyId);
                return;
            }

            this.server.to(lobbyId).emit('game_question', {
                question: {
                    id: result.question.id,
                    ques: result.question.ques,
                    correct_answer: result.question.correct_answer,
                    incorrect_answers: result.question.incorrect_answers,
                },
                index: result.index,
            });
        } catch (error) {
            console.error('Error in sendQuestion:', error);
        }
    }

    private async processRound(lobbyId: string) {
        try {

            const result = await this.sessionService.processRound(lobbyId);
            if (!result) {
                return;
            }

            this.server.to(lobbyId).emit('game_answer_result', {
                correctAnswer: result.correctAnswer,
                leaderboard: result.leaderboard,
            });

            setTimeout(() => {
                this.sendQuestion(lobbyId);
            }, 5000);
        } catch (error) {
            console.error( error);
        }
    }

    private async endGame(lobbyId: string) {
        try {
            const result = await this.sessionService.endGame(lobbyId);
            if (result) {
                this.server.to(lobbyId).emit('game_over', {
                    leaderboard: result.leaderboard,
                });
                setTimeout(() => {
                    this.sessionService.cleanupLobby(lobbyId);
                }, 60000);
            }
        } catch (error) {
            console.error('Error ending game:', error);
        }
    }
}