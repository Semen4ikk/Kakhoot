import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAchievementDto {
    @ApiProperty({
        example: 'Мастер викторин',
        description: 'Название достижения',
    })
    @IsString()
    @IsNotEmpty({ message: 'Название достижения не может быть пустым' })
    name: string;

    @ApiProperty({
        example: 'Пройдите 10 викторин подряд без ошибок',
        description: 'Описание достижения',
    })
    @IsString()
    @IsNotEmpty({ message: 'Описание достижения не может быть пустым' })
    description: string;

    @ApiProperty({
        example: 'quiz_master_10',
        description: 'Уникальный ключ-триггер для активации достижения',
    })
    @IsString()
    @IsNotEmpty({ message: 'Ключ триггера не может быть пустым' })
    triggerKey: string;
}

export type TUpdateAchievementDto = Partial<CreateAchievementDto>;