import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../src/app.module';

const request = require('supertest');
describe('POST /users (Integration)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });


    it('Успешное создание пользователя', async () => {
        const payload = {
            email: 'valid@example.com',
            password: 'strongPass123',
            name: 'Valid User',
            role: 'USER',
        };

        const res = await request(app.getHttpServer())
            .post('/users')
            .send(payload)
            .expect(201);

        expect(res.body).toEqual(
            expect.objectContaining({
                email: payload.email,
                name: payload.name,
                role: payload.role,
            }),
        );
        expect(res.body).not.toHaveProperty('password');
    });


    it('Ошибка при отсутствии email', async () => {
        const payload = {
            password: '123',
            name: 'No Email User',
            role: 'USER',
        };

        const res = await request(app.getHttpServer())
            .post('/users')
            .send(payload)
            .expect(400);

        expect(res.body.message).toContain('email must be an email');
    });


    it('Ошибка при невалидном формате email', async () => {
        const payload = {
            email: 'not-an-email',
            password: '123',
            name: 'Invalid Email User',
            role: 'USER',
        };

        const res = await request(app.getHttpServer())
            .post('/users')
            .send(payload)
            .expect(400);

        expect(res.body.message).toContain('email must be an email');
    });

    it('Ошибка при коротком пароле', async () => {
        const payload = {
            email: 'test2@example.com',
            password: '123',
            name: 'Short Pass User',
            role: 'USER',
        };

        const res = await request(app.getHttpServer())
            .post('/users')
            .send(payload)
            .expect(400);

        expect(res.body.message.some((msg: string) => msg.includes('password'))).toBe(true);
    });

    it('Попытка создать пользователя с уже существующим email', async () => {
        const email = 'duplicate@example.com';
        const payload = {
            email,
            password: 'pass123',
            name: 'Duplicate User',
            role: 'USER',
        };

        await request(app.getHttpServer())
            .post('/users')
            .send(payload)
            .expect(201);

        const res = await request(app.getHttpServer())
            .post('/users')
            .send(payload)
            .expect(400);

        expect(res.body.statusCode).toBe(400);
        expect(res.body.message).toBeDefined();
    });
});