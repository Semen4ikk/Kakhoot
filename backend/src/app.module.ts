import { Module} from '@nestjs/common';
import { UsersModule } from './users/user.module';

import { ConfigModule } from '@nestjs/config';

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

    ],
})
export class AppModule{}

