import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SessionService } from './session.service';

@ApiTags('session')
@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @Get(':lobbyId')
    @ApiOperation({ summary: 'Получить статус лобби' })
    @ApiResponse({ status: 200, description: 'Статус лобби успешно получен' })
    @ApiResponse({ status: 404, description: 'Лобби не найдено' })
    @ApiParam({ name: 'lobbyId', type: 'string', description: 'ID Лобби' })
    getLobbyStatus(@Param('lobbyId') lobbyId: string) {
        const lobby = this.sessionService.getLobby(lobbyId);
        if (!lobby) {
            throw new NotFoundException('Лобби не найдено');
        }
        return {
            id: lobby.id,
            quizId: lobby.quizId,
            status: lobby.status,
            players: lobby.players.map(p => ({
                name: p.name,
                score: p.score,
                isHost: p.isHost
            })),
            currentQuestionIndex: lobby.currentQuestionIndex,
        };
    }
}