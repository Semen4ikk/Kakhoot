import { IsString, IsArray, IsNotEmpty, IsInt, IsPositive, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
    @ApiProperty({
        example: 'Cкильки 2 + 2 ?',
        description: 'Описание вопроса',
    })
    @IsString()
    @IsNotEmpty()
    ques: string;

    @ApiProperty({
        example: '4',
        description: 'Правильный отает',
    })
    @IsString()
    @IsNotEmpty()
    correct_answer: string;

    @ApiProperty({
        example: ['5', '33', '3'],
        description: 'Массив неправильных ответов',
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    incorrect_answer: string[];

    @ApiProperty({
        example: 1,
        description: 'ID of the quiz this question belongs to',
    })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    quizId: number;
}

export type TUpdateQuestionDto = Partial<CreateQuestionDto>;