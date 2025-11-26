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
import { QuestionService } from './question.service';
import { ParseIntPipe } from '../conception/pipe';
import * as questionDto from './question.dto';

@ApiTags('question')
@Controller('question')
export class QuestionController {
    constructor(private readonly questionsService: QuestionService) {
    }

    @Get()
    @ApiOperation({summary: 'Получить все Вопросы'})
    @ApiResponse({status: 200, description: 'Список Вопросов успешно получен'})
    @ApiBearerAuth()
    findAll() {
        return this.questionsService.questionFindAll();
    }
    @Get('quiz/:quizId')
    @ApiOperation({ summary: 'Получить все вопросы по ID квиза' })
    @ApiResponse({ status: 200, description: 'Вопросы успешно получены' })
    @ApiResponse({ status: 404, description: 'Квиз с указанным ID не найден' })
    @ApiParam({ name: 'quizId', type: 'number', description: 'ID квиза' })
    @ApiBearerAuth()
    findByQuizId(@Param('quizId', ParseIntPipe) quizId: number) {
        return this.questionsService.findQuestionsByQuizId(quizId);
    }

    @Get(':id')
    @ApiOperation({summary: 'Получить Вопрос по ID'})
    @ApiResponse({status: 200, description: 'Вопрос успешно получен'})
    @ApiResponse({status: 404, description: 'Вопрос не найден'})
    @ApiParam({name: 'id', type: 'number', description: 'ID Вопроса'})
    getApplication(@Param('id', ParseIntPipe) id: number) {
        return this.questionsService.questionGetById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Создать новую Вопрос'})
    @ApiResponse({status: 201, description: 'Вопрос успешно создан'})
    @ApiResponse({status: 400, description: 'Неверные данные'})
    @ApiBody({type: questionDto.CreateQuestionDto})
    @ApiBearerAuth()
    create(@Body() dto: questionDto.CreateQuestionDto) {
        return this.questionsService.questionCreate(dto);
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
        @Body() dto: questionDto.TUpdateQuestionDto,
    ) {
        return this.questionsService.questionUpdate(id, dto);
    }

    @Delete(':id')
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Удалить Вопрос' })
    @ApiResponse({ status: 200, description: 'Вопрос успешно удален' })
    @ApiResponse({ status: 404, description: 'Вопрос не найден' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID Вопроса' })
    @ApiBearerAuth()
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.questionsService.questionDelete(id);
    }
}
