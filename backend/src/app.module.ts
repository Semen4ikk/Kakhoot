import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/user.module';
import { JwtMiddleware} from './conception/middleware';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {QuizModule} from "./quizs/quiz.module";
import {QuestionModule} from "./questions/question.module";
import {AchievementModule} from "./achievement/achievement.module";



@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UsersModule,
        QuizModule,
        QuestionModule,
        AchievementModule,
        JwtModule.register({
            secret: 'secret',
            signOptions: { expiresIn: '1h' },
        }),
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(JwtMiddleware)
    }
}
