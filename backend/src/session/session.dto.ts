import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLobbyDto {
    @ApiProperty({ description: 'Имя игрока', example: 'Alex' })
    @IsString()
    @IsNotEmpty()
    playerName: string;

    @ApiProperty({ description: 'ID Квиза', example: '1' })
    @IsString()
    @IsNotEmpty()
    quizId: string;
}

export class JoinLobbyDto {
    @ApiProperty({ description: 'ID Лобби', example: 'A7B2C' })
    @IsString()
    @IsNotEmpty()
    lobbyId: string;

    @ApiProperty({ description: 'Имя игрока', example: 'Maria' })
    @IsString()
    @IsNotEmpty()
    playerName: string;
}

export class StartGameDto {
    @ApiProperty({ description: 'ID Лобби', example: 'A7B2C' })
    @IsString()
    @IsNotEmpty()
    lobbyId: string;
}

export class SubmitAnswerDto {
    @ApiProperty({ description: 'ID Лобби', example: 'A7B2C' })
    @IsString()
    @IsNotEmpty()
    lobbyId: string;

    @ApiProperty({ description: 'Индекс вопроса', example: '0' })
    @IsString()
    @IsNotEmpty()
    questionIndex: string;

    @ApiProperty({ description: 'Индекс ответа', example: '1' })
    @IsString()
    @IsNotEmpty()
    answerIndex: string;
}