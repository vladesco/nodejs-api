import express, { NextFunction, Response, Request } from 'express';
import { PostgreDataAccess } from '../data-access';
import { HttpStatusCode } from '../errors';
import { UserModel } from '../models';
import { UserControllerRrovider } from '../routes/controllers';
import { UserService } from '../serivces';
import { UserDTO, WithId } from '../types';

export const setupExpress = async (port: number) => {
    const app = express();

    const userAccessService = new PostgreDataAccess<WithId<UserDTO>>(UserModel);
    const userService = new UserService(userAccessService);
    const userControllerProvider = new UserControllerRrovider(userService);

    app.use(express.json());
    app.use('/', userControllerProvider.provideController());

    //default error handler
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    });

    app.listen(port, () => console.log(`server listens ${port} port`));
};
