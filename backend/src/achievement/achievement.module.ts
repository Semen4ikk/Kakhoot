import { Module } from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {ConfigService} from "@nestjs/config";
import {AchievementService} from "./achievement.service";
import {AchievementController} from "./achievement.controller";

@Module({
    controllers: [AchievementController],
    providers: [AchievementService, PrismaService, ConfigService],
})
export class AchievementModule {}