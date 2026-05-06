import { Module } from '@nestjs/common';

import {ConfigService} from "@nestjs/config";
import {AchievementService} from "./achievement.service.js";
import {AchievementController} from "./achievement.controller.js";
import {PrismaService} from "../prisma.service.js";

@Module({
    controllers: [AchievementController],
    providers: [AchievementService, PrismaService, ConfigService],
})
export class AchievementModule {}