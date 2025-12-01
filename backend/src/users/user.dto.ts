import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUsersDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'The email address of the user',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'The password of the user',
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'The full name of the user',
    })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({
        enum: Role,
        example: Role.USER,
        description: 'The role of the user',
        required: false,
    })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}

export type TUpdateUsersDto = Partial<CreateUsersDto>;