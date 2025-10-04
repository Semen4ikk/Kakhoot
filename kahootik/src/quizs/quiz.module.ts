import {Module} from "@nestjs/common";
import {PrismaService} from "../prisma.service";
import {ConfigService} from "@nestjs/config";
import {QuizService} from "./quiz.service";
import {QuizController} from "./quiz.controller";

@Module({
    controllers: [QuizController],
    providers: [QuizService, PrismaService, ConfigService],
})
export class QuizModule {}