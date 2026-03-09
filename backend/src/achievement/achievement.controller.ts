import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { ParseIntPipe } from '../conception/pipe';
import {AchievementService} from "./achievement.service";
import {CreateAchievementDto} from "./achievement.dto";

@ApiTags('achievement')
@Controller('achievement')
export class AchievementController {
    constructor(private readonly achievementService: AchievementService) {
    }

    @Get()
    @ApiOperation({summary: 'Получить все достижения'})
    @ApiResponse({status: 200, description: 'Список Достижений успешно получен'})
    @ApiBearerAuth()
    findAll() {
        return this.achievementService.achievementFindAll();
    }

    @Get(':id')
    @ApiOperation({summary: 'Получить Достижение по ID'})
    @ApiResponse({status: 200, description: 'Достижение успешно получен'})
    @ApiResponse({status: 404, description: 'Достижение не найден'})
    @ApiParam({name: 'id', type: 'number', description: 'ID Достижения'})
    getApplication(@Param('id', ParseIntPipe) id: number) {
        return this.achievementService.achievementGetById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Создать новое Достижение'})
    @ApiResponse({status: 201, description: 'Достижение успешно создано'})
    @ApiResponse({status: 400, description: 'Неверные данные'})
    @ApiBody({type: CreateAchievementDto})
    @ApiBearerAuth()
    create(@Body() dto: CreateAchievementDto) {
        return this.achievementService.achievementCreate(dto);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Обновить Достижение'})
    @ApiResponse({status: 200, description: 'Достижение успешно обновлен'})
    @ApiResponse({status: 400, description: 'Неверные данные'})
    @ApiResponse({status: 404, description: 'Достижение не найден'})
    @ApiParam({name: 'id', type: 'number', description: 'ID Достижение'})
    @ApiBearerAuth()
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreateAchievementDto,
    ) {
        return this.achievementService.achievementUpdate(id, dto);
    }

    @Delete(':id')
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Удалить Достижение' })
    @ApiResponse({ status: 200, description: 'Достижение успешно удален' })
    @ApiResponse({ status: 404, description: 'Достижение не найден' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID Достижение' })
    @ApiBearerAuth()
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.achievementService.achievementDelete(id);
    }
}
