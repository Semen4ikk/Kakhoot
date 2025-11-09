import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizDto {
    @ApiProperty({
        example: 'Для малышей',
        description: 'Название квиза',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty({
        example: 'Матеша',
        description: 'Категория квиза',
    })
    @IsString()
    @IsNotEmpty()
    category: string;
}

export type TUpdateQuizDto = Partial<CreateQuizDto>;