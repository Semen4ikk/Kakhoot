
import {IsEmail, IsEnum, IsOptional, IsString} from "class-validator";



import { ApiProperty } from '@nestjs/swagger';
import { Role } from "generated/prisma/client";




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
    password: string;

    @ApiProperty({
        enum: Role,
        example: Role.USER,
        description: 'The role of the user (optional)',
        required: false,
    })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}

export type TUpdateUsersDto = Partial<CreateUsersDto>;
