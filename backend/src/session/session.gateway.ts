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
import { CreateLobbyDto, JoinLobbyDto, StartGameDto, SubmitAnswerDto } from './session.dto';
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
    handleStartGame(
        @MessageBody() dto: StartGameDto,
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const lobby = this.sessionService.startGame(dto.lobbyId, client.id);
            this.server.to(lobby.id).emit('game_started', {
                lobbyId: lobby.id,
                quizId: lobby.quizId,
                status: lobby.status,
                players: lobby.players,
            });
            this.logger.log(`Game started in lobby: ${lobby.id}`);
        } catch (error) {
            client.emit('error', { message: error.message });
        }
    }

    @SubscribeMessage('submit_answer')
    @UsePipes(new ValidationPipe())
    handleSubmitAnswer(
        @MessageBody() dto: SubmitAnswerDto,
        @ConnectedSocket() client: Socket,
    ) {
        const lobby = this.sessionService.submitAnswer(
            dto.lobbyId,
            client.id,
            parseInt(dto.questionIndex),
            parseInt(dto.answerIndex),
        );

        if (lobby) {
            client.emit('answer_accepted', {
                questionIndex: dto.questionIndex,
                totalAnswers: Object.keys(lobby.answers).length,
                totalPlayers: lobby.players.length
            });
        }
    }

    handleDisconnect(client: Socket) {
        const { lobbyId, isHost } = this.sessionService.removePlayer(client.id);
        if (lobbyId) {
            if (isHost) {
                this.server.to(lobbyId).emit('lobby_closed', { reason: 'Хост покинул игру' });
                this.logger.log(`Lobby ${lobbyId} closed (host disconnected)`);
            } else {
                const lobby = this.sessionService.getLobby(lobbyId);
                if (lobby) {
                    this.server.to(lobbyId).emit('lobby_updated', lobby);
                }
                this.logger.log(`Player disconnected from lobby ${lobbyId}`);
            }
        }
    }
}