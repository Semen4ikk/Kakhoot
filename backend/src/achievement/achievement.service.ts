import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {CreateAchievementDto, TUpdateAchievementDto} from "./achievement.dto";



@Injectable()
export class AchievementService {
    constructor(private readonly prisma: PrismaService) {}

    achievementFindAll() {
        return this.prisma.achievement.findMany();
    }

    async achievementGetById(id: number) {
        const achievement = await this.prisma.achievement.findUnique({
            where: { id },
        });

        if (!achievement) {
            throw new NotFoundException(`achievement with ID ${id} not found`);
        }

        return achievement;
    }

    achievementCreate(dto: CreateAchievementDto) {
        return this.prisma.achievement.create({
            data: dto,
        });
    }

    async achievementUpdate(id: number, dto: TUpdateAchievementDto) {
        await this.achievementGetById(id);
        return this.prisma.achievement.update({
            where: { id },
            data: dto,
        });
    }

    async achievementDelete(id: number) {
        await this.achievementGetById(id);
        return this.prisma.achievement.delete({
            where: { id },
        });
    }
}