import { Module} from '@nestjs/common';
import { UsersModule } from './users/user.module.js';

import { ConfigModule } from '@nestjs/config';

import {QuizModule} from "./quizs/quiz.module.js";
import {QuestionModule} from "./questions/question.module.js";
import {AchievementModule} from "./achievement/achievement.module.js";
import {SessionModule} from "./session/session.module.js";



@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UsersModule,
        QuizModule,
        QuestionModule,
        AchievementModule,
        SessionModule,

    ],
})
export class AppModule{}

