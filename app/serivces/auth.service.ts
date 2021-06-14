import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import { Config } from '../config';
import { AuthentificationDataAccess } from '../data-access';
import { PerformanceLogger } from '../decorators';
import { configToken, Inject, Injectable } from '../di';
import { AuthorizationError, ForbiddenError, ValidationError } from '../errors';
import { LoggerLevel } from '../logger';
import { UserCredetialsDTO } from '../models';
import { userCredentialsValidator } from '../validation';

const DEFAULT_DEVICE = 'default device';

@Injectable()
export class AuthentificationService {
    private accessTokenExpiredTime: number;
    private refreshTokenExpiredTime: number;
    private secret: string;

    constructor(
        private authAccessService: AuthentificationDataAccess,
        @Inject(configToken)
        { secret, accessTokenExpiredTime, refreshTokenExpiredTime }: Config
    ) {
        this.secret = secret;
        this.accessTokenExpiredTime = accessTokenExpiredTime;
        this.refreshTokenExpiredTime = refreshTokenExpiredTime;
    }

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async checkAccessToken(accessToken: string | undefined): Promise<void> {
        if (!accessToken) {
            throw new ForbiddenError('you are not logged in');
        }

        try {
            jwt.verify(accessToken, this.secret);
        } catch {
            throw new ForbiddenError('something went wrong. Please re-login');
        }
    }

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async authentificate(
        userCredentials: UserCredetialsDTO,
        deviceInformation: string = DEFAULT_DEVICE
    ): Promise<[string, string]> {
        const { error } = userCredentialsValidator.validate(userCredentials);

        if (error) {
            throw new ValidationError(error.message);
        }

        const [authentificatedUser] = await this.authAccessService.findUsersByCredentials(
            userCredentials.login,
            userCredentials.password
        );

        const deviceId = createHash('sha256').update(deviceInformation).digest('base64');

        if (!authentificatedUser) {
            throw new AuthorizationError('there are no any users with such credentials');
        }

        const accessToken = jwt.sign({ id: authentificatedUser.id }, this.secret, {
            expiresIn: this.accessTokenExpiredTime,
        });

        const refreshToken = jwt.sign({ id: authentificatedUser.id }, this.secret, {
            expiresIn: this.refreshTokenExpiredTime,
        });

        await this.authAccessService.authentificateUser(
            authentificatedUser.id,
            refreshToken,
            deviceId
        );

        return [accessToken, refreshToken];
    }

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async refreshTokens(
        refreshToken: string,
        deviceInformation: string = DEFAULT_DEVICE
    ): Promise<[string, string]> {
        try {
            jwt.verify(refreshToken, this.secret);
        } catch {
            throw new ForbiddenError('something went wrong. Please re-login');
        }

        const userInfo = jwt.decode(refreshToken, { json: true });
        const deviceId = createHash('sha256').update(deviceInformation).digest('base64');
        const userId = userInfo?.id;

        const newAccessToken = jwt.sign({ id: userId }, this.secret, {
            expiresIn: this.accessTokenExpiredTime,
        });

        const newRefreshToken = jwt.sign({ id: userId }, this.secret, {
            expiresIn: this.refreshTokenExpiredTime,
        });

        await this.authAccessService.setNewRefreshToken(userId, newRefreshToken, deviceId);

        return [newAccessToken, newRefreshToken];
    }
}
