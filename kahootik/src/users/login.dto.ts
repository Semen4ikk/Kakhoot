import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        example: 'mem@ka.com',
        description: 'Email пользователя',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '12345678',
        description: 'Пароль пользователя',
    })
    @IsString()
    password: string;
}
