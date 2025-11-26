import { IsString, IsArray, IsNotEmpty, IsInt, IsPositive, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
    @ApiProperty({
        example: 'Скільки 2 + 2?',
        description: 'Текст вопроса',
    })
    @IsString()
    @IsNotEmpty()
    ques: string;

    @ApiProperty({
        example: '4',
        description: 'Правильный ответ',
    })
    @IsString()
    @IsNotEmpty()
    correct_answer: string;

    @ApiProperty({
        example: ['1', '3', '5'],
        description: 'Массив неправильных ответов (минимум 1, все непустые строки)',
    })
    @IsArray()
    @ArrayNotEmpty({ message: 'Массив неправильных ответов не может быть пустым' })
    @IsString({ each: true, message: 'Каждый неправильный ответ должен быть строкой' })
    @IsNotEmpty({ each: true, message: 'Неправильный ответ не может быть пустой строкой' })
    incorrect_answers: string[];

    @ApiProperty({
        example: 1,
        description: 'ID викторины, к которой относится вопрос',
    })
    @IsInt({ message: 'quizId должен быть целым числом' })
    @IsPositive({ message: 'quizId должен быть положительным' })
    quizId: number;
}

export type TUpdateQuestionDto = Partial<CreateQuestionDto>;