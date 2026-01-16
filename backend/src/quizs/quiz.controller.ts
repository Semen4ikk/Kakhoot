import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put, Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { ParseIntPipe } from '../conception/pipe';
import * as quizDto from './quiz.dto';


@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
    constructor(private readonly quizsService: QuizService) {
    }

    @Get()
    @ApiOperation({ summary: 'Получить все квизы' })
    @ApiResponse({ status: 200, description: 'Список квизов успешно получен' })
    @ApiBearerAuth()
    findAll(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 9,
    ) {
        if (page < 1 || limit < 1) {
            throw new BadRequestException('Page and limit must be >= 1');
        }
        return this.quizsService.quizFindAll(page, limit);
    }

    @Get(':id')
    @ApiOperation({summary: 'Получить заявку по ID'})
    @ApiResponse({status: 200, description: 'Квиз успешно получен'})
    @ApiResponse({status: 404, description: 'Квиз не найден'})
    @ApiParam({name: 'id', type: 'number', description: 'ID Квиза'})
    getApplication(@Param('id', ParseIntPipe) id: number) {
        return this.quizsService.quizGetById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Создать новый Квиз'})
    @ApiResponse({status: 201, description: 'Квиз успешно создан'})
    @ApiResponse({status: 400, description: 'Неверные данные'})
    @ApiBody({type: quizDto.CreateQuizDto})
    @ApiBearerAuth()
    create(@Body() dto: quizDto.CreateQuizDto) {
        return this.quizsService.quizCreate(dto);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Обновить Квиз'})
    @ApiResponse({status: 200, description: 'Квиз успешно обновлен'})
    @ApiResponse({status: 400, description: 'Неверные данные'})
    @ApiResponse({status: 404, description: 'Квиз не найден'})
    @ApiParam({name: 'id', type: 'number', description: 'ID Квиза'})
    @ApiBearerAuth()
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: quizDto.TUpdateQuizDto,
    ) {
        return this.quizsService.quizUpdate(id, dto);
    }

    @Delete(':id')
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Удалить Квиз' })
    @ApiResponse({ status: 200, description: 'Квиз успешно удален' })
    @ApiResponse({ status: 404, description: 'Квиз не найден' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID Квиза' })
    @ApiBearerAuth()
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.quizsService.quizDelete(id);
    }
}
