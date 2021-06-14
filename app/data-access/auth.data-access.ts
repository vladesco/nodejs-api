import { Inject, Injectable, UserAuthentificationObjectToken } from '../di';
import { UserAuthentifications, UserDTO } from '../models';
import { WithId } from '../types';
import { OneToManyDataAccess } from './types';

@Injectable()
export class AuthentificationDataAccess {
    constructor(
        @Inject(UserAuthentificationObjectToken)
        private dataAccess: OneToManyDataAccess<UserAuthentifications>
    ) {}

    public async findUsersByCredentials(
        login: string,
        password: string
    ): Promise<WithId<UserDTO>[]> {
        return this.dataAccess.getByFields({ login, password }, { exact: true });
    }

    public async authentificateUser(
        userId: string,
        refreshToken: string,
        deviceId: string
    ): Promise<UserAuthentifications> {
        const userAuthentifications = await this.dataAccess.getByPK(userId);
        const deviceAuthentification = userAuthentifications.authentifications.find(
            (authentification) => authentification.deviceId === deviceId
        );

        if (deviceAuthentification) {
            deviceAuthentification.refreshToken = refreshToken;
        } else {
            userAuthentifications.authentifications.push({
                userId,
                refreshToken,
                deviceId,
            });
        }

        await this.dataAccess.updateByPK(userId, userAuthentifications);

        return userAuthentifications;
    }

    public async setNewRefreshToken(
        userId: string,
        refreshToken: string,
        deviceId: string
    ): Promise<void> {
        const userAuthentifications = await this.dataAccess.getByPK(userId);

        const deviceAuthentification = userAuthentifications.authentifications.find(
            (authenification) => authenification.deviceId === deviceId
        );

        if (deviceAuthentification) {
            deviceAuthentification.refreshToken = refreshToken;
        }

        await this.dataAccess.updateByPK(userId, userAuthentifications);
    }
}
