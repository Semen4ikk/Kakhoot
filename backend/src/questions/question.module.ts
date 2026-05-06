import { Module } from '@nestjs/common';
import { QuestionService } from './question.service.js';
import { QuestionController } from './question.controller.js';
import {PrismaService} from "../prisma.service.js";
import {ConfigService} from "@nestjs/config";

@Module({
    controllers: [QuestionController],
    providers: [QuestionService, PrismaService, ConfigService],
})
export class QuestionModule {}