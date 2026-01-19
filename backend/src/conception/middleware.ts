
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class JwtMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    use(req: any, res: any, next: () => void) {
        console.log(`Request URL: ${req.url}`);

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Token is missing or invalid');
            throw new UnauthorizedException('Отсутствует или неверный токен');
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = this.jwtService.verify(token);
            console.log('Token verified:', payload);
            req.user = payload;
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            throw new UnauthorizedException('Неверный или просроченный токен');
        }
    }
}
