import { Module } from '@nestjs/common';
import { SessionGateway } from './session.gateway';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { QuizModule } from '../quizs/quiz.module';

@Module({
    imports: [QuizModule],
    controllers: [SessionController],
    providers: [SessionGateway, SessionService],
    exports: [SessionService],
})
export class SessionModule {}