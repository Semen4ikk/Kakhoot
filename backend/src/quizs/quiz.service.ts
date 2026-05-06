import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateQuizDto, TUpdateQuizDto } from './quiz.dto.js';
import {PrismaService} from "../prisma.service.js";




@Injectable()
export class QuizService {
    constructor(private readonly prisma: PrismaService) {}

    quizFindAll(page: number, limit: number) {
        const skip = (page - 1) * limit;
        return this.prisma.quiz.findMany({
            skip,
            take: limit,
            include: {
                questions: true,
            },
        });
    }

    async quizGetById(id: number) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: true,
            },
        });

        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }

        return quiz;
    }

    async quizCreate(dto: CreateQuizDto) {
        const { questions, ...quizData } = dto;

        return this.prisma.quiz.create({
            data: {
                ...quizData,
                questions: {
                    create: questions.map(q => ({
                        ques: q.ques,
                        correct_answer: q.correct_answer,
                        incorrect_answers: q.incorrect_answers,
                    })),
                },
            },
            include: {
                questions: true,
            },
        });
    }

    async quizUpdate(id: number, dto: TUpdateQuizDto) {
        // 1. Проверяем, что квиз существует
        await this.quizGetById(id);

        // 2. Отделяем вопросы от полей самого квиза
        const { questions, ...quizData } = dto;

        return this.prisma.quiz.update({
            where: { id },
            data: {
                ...quizData,
                ...(questions && {
                    questions: {
                        deleteMany: {},
                        create: questions.map(q => ({
                            ques: q.ques,
                            correct_answer: q.correct_answer,
                            incorrect_answers: q.incorrect_answers,
                        })),
                    },
                }),
            },
            include: { questions: true },
        });
    }

    async quizDelete(id: number) {
        await this.quizGetById(id);

        return this.prisma.quiz.delete({
            where: { id },
        });
    }
    async getQuestions(quizId: number) {
        const questions = await this.prisma.question.findMany({
            where: { quizId },
            orderBy: {
                id: 'asc',
            },
        });

        return questions.map((q) => ({
            id: q.id,
            question: q.ques,
            correct_answer: q.correct_answer,
            incorrect_answers: q.incorrect_answers,
            quizId: q.quizId,
        }));
    }
}