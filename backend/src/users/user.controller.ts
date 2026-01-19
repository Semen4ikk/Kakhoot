
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put, UnauthorizedException,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { ParseIntPipe } from '../conception/pipe';
import * as userDto from './user.dto';
import {LoginDto} from "./login.dto";


@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({status: 200, description: 'Список пользователей успешно получен'})
    @ApiBearerAuth()
    findAll() {
        return this.usersService.userFindAll();
    }

    @Get(':id')
    @ApiOperation({summary: 'Получить пользователя по ID'})
    @ApiResponse({status: 200, description: 'Пользователь успешно получен'})
    @ApiResponse({status: 404, description: 'Пользователь не найден'})
    @ApiParam({name: 'id', type: 'number', description: 'ID пользователя'})
    getUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.userGetById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Создать нового пользователя'})
    @ApiResponse({status: 201, description: 'Пользователь успешно создан'})
    @ApiResponse({status: 400, description: 'Неверные данные'})
    @ApiBody({type: userDto.CreateUsersDto})
    create(@Body() dto: userDto.CreateUsersDto) {
        return this.usersService.userCreate(dto);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())

    @ApiOperation({summary: 'Обновить пользователя'})
    @ApiResponse({status: 200, description: 'Пользователь успешно обновлен'})
    @ApiResponse({status: 400, description: 'Неверные данные'})
    @ApiResponse({status: 404, description: 'Пользователь не найден'})
    @ApiParam({name: 'id', type: 'number', description: 'ID пользователя'})
    @ApiBody({type: userDto.CreateUsersDto})
    @ApiBearerAuth()
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: userDto.TUpdateUsersDto,
    ) {
        return this.usersService.userUpdate(id, dto);
    }

    @Delete(':id')
    @UsePipes(new ValidationPipe())

    @ApiOperation({ summary: 'Удалить пользователя' })
    @ApiResponse({ status: 200, description: 'Пользователь успешно удален' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID пользователя' })
    @ApiBearerAuth()
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.userDelete(id);
    }

    @Post('login')
    @ApiOperation({ summary: 'Вход пользователя' })
    @ApiResponse({ status: 200, description: 'Пользователь успешно вошёл' })
    @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
    @ApiBody({ type: LoginDto })
    async login(@Body() dto: LoginDto): Promise<{ user: { id: number; name: string; email: string } }> {
        const user = await this.usersService.validateUser(dto.email, dto.password);

        if (!user) {
            throw new UnauthorizedException('Неверный email или пароль');
        }

        return { user };
    }
}
