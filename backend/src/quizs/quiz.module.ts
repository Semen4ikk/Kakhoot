import {Module} from "@nestjs/common";
import {PrismaService} from "../prisma.service.js";
import {ConfigService} from "@nestjs/config";
import {QuizService} from "./quiz.service.js";
import {QuizController} from "./quiz.controller.js";

@Module({
    controllers: [QuizController],
    providers: [QuizService, PrismaService, ConfigService],
    exports: [QuizService],
})
export class QuizModule {}