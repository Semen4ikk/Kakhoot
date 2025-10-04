import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import {PrismaService} from "../prisma.service";
import {ConfigService} from "@nestjs/config";

@Module({
    controllers: [QuestionController],
    providers: [QuestionService, PrismaService, ConfigService],
})
export class QuestionModule {}