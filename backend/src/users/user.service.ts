import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { CreateUsersDto, TUpdateUsersDto } from './user.dto';

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
        return this.prisma.user.create({
            data: {
                ...dto,
                password: hashedPassword,
            },
        });
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
