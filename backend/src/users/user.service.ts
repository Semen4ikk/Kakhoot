import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { CreateUsersDto, TUpdateUsersDto } from './user.dto';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/client";

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}


    userFindAll() {
        return this.prisma.user.findMany();
    }


    async userGetById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        return user;
    }



    async userCreate(dto: CreateUsersDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        try {
            return await this.prisma.user.create({
                data: {
                    ...dto,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                },
            });
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                const target = error.meta?.target;
                if (Array.isArray(target) && target.includes('email')) {
                    throw new BadRequestException('Пользователь с таким email уже существует');
                }
                throw new BadRequestException('Данные, которые вы пытаетесь использовать, уже заняты');
            }
            throw error;
        }
    }


    userUpdate(id: number, dto: TUpdateUsersDto) {
        return this.prisma.user.update({
            where: { id },
            data: dto,
        });
    }


    userDelete(id: number) {
        return this.prisma.user.delete({
            where: { id },
        });
    }


    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Пользователь с таким email не найден');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный пароль');
        }

        return user;
    }


    generateToken(user: any): string {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload, { expiresIn: '1h' });
    }
}
