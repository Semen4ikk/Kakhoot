import { Module } from '@nestjs/common';
import { SessionGateway } from './session.gateway.js';
import { SessionService } from './session.service.js';
import { SessionController } from './session.controller.js';
import { QuizModule } from '../quizs/quiz.module.js';

@Module({
    imports: [QuizModule],
    controllers: [SessionController],
    providers: [SessionGateway, SessionService],
    exports: [SessionService],
})
export class SessionModule {}