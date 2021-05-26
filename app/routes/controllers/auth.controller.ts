import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { ErrorLogger } from '../../decorators';
import { Injectable } from '../../di';
import { LoggerLevel } from '../../logger';
import { UserCredetialsDTO } from '../../models';
import { AuthentificationService } from '../../serivces';

@Injectable()
export class AuthentificationController {
    constructor(private authentificationService: AuthentificationService) {}

    @ErrorLogger(LoggerLevel.ERROR)
    public provideController(): Router {
        const controller = Router();

        controller.post('/login', this.login.bind(this));
        controller.get('/refresh-tokens', this.refreshTokens.bind(this));

        return controller;
    }

    @ErrorLogger(LoggerLevel.ERROR)
    public provideMiddleware(): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction) => {
            await this.checkAccessToken(req, res);
            next();
        };
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async login(req: Request, res: Response) {
        const credentials: UserCredetialsDTO = req.body;
        const deviceInformation = req.headers['user-agent'];

        const [accessToken, refreshToken] = await this.authentificationService.authentificate(
            credentials,
            deviceInformation
        );

        res.cookie('refresh', refreshToken, { httpOnly: true, path: '/refresh-tokens' });
        res.json({ accessToken });
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async refreshTokens(req: Request, res: Response) {
        const refreshToken = req.cookies['refresh'];
        const deviceInformation = req.headers['user-agent'];

        console.log(req.cookies);

        const [newAccessToken, newRefreshToken] = await this.authentificationService.refreshTokens(
            refreshToken,
            deviceInformation
        );

        res.cookie('refresh', newRefreshToken, { httpOnly: true, path: '/refresh-token' });
        res.json({ accessToken: newAccessToken });
    }

    private async checkAccessToken(req: Request, res: Response): Promise<void> {
        const accessToken = req.headers['barrier'] as string;

        await this.authentificationService.checkAccessToken(accessToken);
    }
}
