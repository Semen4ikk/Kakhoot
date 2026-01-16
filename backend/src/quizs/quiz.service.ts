import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuizDto, TUpdateQuizDto } from './quiz.dto';

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

    quizCreate(dto: CreateQuizDto) {
        return this.prisma.quiz.create({
            data: dto,
        });
    }

    async quizUpdate(id: number, dto: TUpdateQuizDto) {
        await this.quizGetById(id);

        return this.prisma.quiz.update({
            where: { id },
            data: dto,
        });
    }

    async quizDelete(id: number) {
        await this.quizGetById(id);

        return this.prisma.quiz.delete({
            where: { id },
        });
    }
}