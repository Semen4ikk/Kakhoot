import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as os from 'os';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    const config = new DocumentBuilder()
        .setTitle('API Documentation Joiny')
        .setDescription('Приложение для квизов "Joiny"')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const PORT = process.env.PORT ?? 4200;

    await app.listen(PORT, '0.0.0.0');

    console.log(`🚀 Backend running on:`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   Network: http://${getLocalIP()}:${PORT}`);
    console.log(`   Swagger: http://${getLocalIP()}:${PORT}/api/docs`);
}

function getLocalIP(): string {
    const interfaces = os.networkInterfaces();

    for (const devName in interfaces) {
        const iface = interfaces[devName];
        if (!iface) continue;

        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

bootstrap();