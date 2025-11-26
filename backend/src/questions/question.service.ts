import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuestionDto, TUpdateQuestionDto } from './question.dto';

@Injectable()
export class QuestionService {
    constructor(private readonly prisma: PrismaService) {}

    questionFindAll() {
        return this.prisma.question.findMany({
            include: {
                quiz: true,
            },
        });
    }
    async findQuestionsByQuizId(quizId: number) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId },
        });

        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${quizId} not found`);
        }

        return this.prisma.question.findMany({
            where: { quizId },
            include: {
                quiz: true,
            },
        });
    }

    async questionGetById(id: number) {
        const question = await this.prisma.question.findUnique({
            where: { id },
            include: {
                quiz: true,
            },
        });

        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }

        return question;
    }

    questionCreate(dto: CreateQuestionDto) {
        return this.prisma.question.create({
            data: dto,
        });
    }

    async questionUpdate(id: number, dto: TUpdateQuestionDto) {
        await this.questionGetById(id);
        return this.prisma.question.update({
            where: { id },
            data: dto,
        });
    }

    async questionDelete(id: number) {
        await this.questionGetById(id);
        return this.prisma.question.delete({
            where: { id },
        });
    }
}