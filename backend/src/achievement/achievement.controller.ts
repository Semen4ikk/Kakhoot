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
    @ApiOperation({summary: 'Получить все Вопросы'})
    @ApiResponse({status: 200, description: 'Список Вопросов успешно получен'})
    @ApiBearerAuth()
    findAll() {
        return this.achievementService.achievementFindAll();
    }

    @Get(':id')
    @ApiOperation({summary: 'Получить Вопрос по ID'})
    @ApiResponse({status: 200, description: 'Вопрос успешно получен'})
    @ApiResponse({status: 404, description: 'Вопрос не найден'})
    @ApiParam({name: 'id', type: 'number', description: 'ID Вопроса'})
    getApplication(@Param('id', ParseIntPipe) id: number) {
        return this.achievementService.achievementGetById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Создать новую Вопрос'})
    @ApiResponse({status: 201, description: 'Вопрос успешно создан'})
    @ApiResponse({status: 400, description: 'Неверные данные'})
    @ApiBody({type: CreateAchievementDto})
    @ApiBearerAuth()
    create(@Body() dto: CreateAchievementDto) {
        return this.achievementService.achievementCreate(dto);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Обновить Вопрос'})
    @ApiResponse({status: 200, description: 'Вопрос успешно обновлен'})
    @ApiResponse({status: 400, description: 'Неверные данные'})
    @ApiResponse({status: 404, description: 'Вопрос не найден'})
    @ApiParam({name: 'id', type: 'number', description: 'ID Вопроса'})
    @ApiBearerAuth()
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreateAchievementDto,
    ) {
        return this.achievementService.achievementUpdate(id, dto);
    }

    @Delete(':id')
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Удалить Вопрос' })
    @ApiResponse({ status: 200, description: 'Вопрос успешно удален' })
    @ApiResponse({ status: 404, description: 'Вопрос не найден' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID Вопроса' })
    @ApiBearerAuth()
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.achievementService.achievementDelete(id);
    }
}
