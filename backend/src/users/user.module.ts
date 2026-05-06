import { Module } from '@nestjs/common';
import { UsersService } from './user.service.js';
import { UsersController } from './user.controller.js';

import {ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {PrismaService} from "../prisma.service.js";

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1h' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, PrismaService],
})
export class UsersModule {}
