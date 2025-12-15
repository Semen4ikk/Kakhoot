import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/user.service';
import { PrismaService } from '../src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {Role} from "@prisma/client";



const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: "string",
    role: Role.USER,
    created_at: new Date(),
    updated_at: new Date(),
};



describe('UsersService', () => {
    let service: UsersService;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('Сервис создан', () => {
        expect(service).toBeDefined();
    });

    describe('userFindAll', () => {
        it('Все юзеры', async () => {
            jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([mockUser]);

            const result = await service.userFindAll();
            expect(result).toEqual([mockUser]);
            expect(prismaService.user.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('userGetById', () => {
        it('Должен вернуть юзера по ID', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

            const result = await service.userGetById(1);
            expect(result).toEqual(mockUser);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('Должен выдать ошибку что юзера нет', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

            await expect(service.userGetById(999)).rejects.toThrow('Пользователь не найден');
        });
    });

    describe('userUpdate', () => {
        it('Обновление Юзера', async () => {
            const updateDto = { email: 'updated@example.com' };
            const updatedUser = { ...mockUser, email: 'updated@example.com' };
            jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

            const result = await service.userUpdate(1, updateDto);
            expect(result).toEqual(updatedUser);
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: updateDto,
            });
        });
    });

    describe('userDelete', () => {
        it('Удаление юзера', async () => {
            jest.spyOn(prismaService.user, 'delete').mockResolvedValue(mockUser);

            const result = await service.userDelete(1);
            expect(result).toEqual(mockUser);
            expect(prismaService.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });


    describe('generateToken', () => {
        it('Генерация JWT', () => {
            const token = 'mocked.jwt.token';
            jest.spyOn(jwtService, 'sign').mockReturnValue(token);

            const result = service.generateToken(mockUser);
            expect(result).toBe(token);
            expect(jwtService.sign).toHaveBeenCalledWith(
                { sub: mockUser.id, email: mockUser.email },
                { expiresIn: '1h' }
            );
        });
    });
});