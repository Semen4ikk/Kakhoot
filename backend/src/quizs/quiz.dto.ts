import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsInt,
    Min,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateQuestionDto {
    @ApiProperty({ example: 'Сколько будет 2 + 2?', description: 'Текст вопроса' })
    @IsString()
    @IsNotEmpty()
    ques: string;

    @ApiProperty({ example: '4', description: 'Правильный ответ' })
    @IsString()
    @IsNotEmpty()
    correct_answer: string;

    @ApiProperty({
        example: ['3', '5', '10'],
        description: 'Список неправильных ответов',
        type: [String],
    })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    incorrect_answers: string[];
}

export class CreateQuizDto {
    @ApiProperty({
        example: 'Для малышей',
        description: 'Название квиза',
        minLength: 3,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @ApiProperty({
        example: 'Матеша',
        description: 'Категория квиза',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    category: string;

    @ApiProperty({ example: 1, description: 'ID пользователя, создающего квиз' })
    @IsInt()
    @Min(1)
    userId: number;

    @ApiProperty({
        type: [CreateQuestionDto],
        description: 'Список вопросов, которые будут созданы вместе с квизом',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[];
}

export class TUpdateQuizDto extends PartialType(CreateQuizDto) {}