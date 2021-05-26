import express, { NextFunction, Response, Request } from 'express';
import cookies from 'cookie-parser';
import cors from 'cors';
import { Config } from '../config';
import { configToken, container, loggerToken } from '../di';

import { HttpStatusCode } from '../errors';
import { LoggerMap } from '../logger';
import {
    AuthentificationController,
    GroupController,
    UserController,
    UserGroupController,
} from '../routes/controllers';

export const setupExpress = async () => {
    const app = express();

    const { port } = container.resolve<Config>(configToken);
    const logger = container.resolve<LoggerMap>(loggerToken);

    const userController = container.resolve(UserController);
    const groupController = container.resolve(GroupController);
    const userGroupContoller = container.resolve(UserGroupController);
    const authentificationController = container.resolve(AuthentificationController);

    app.use(cookies());
    app.use(cors());
    app.use(express.json());

    app.use('/', authentificationController.provideController());
    app.use(authentificationController.provideMiddleware());

    app.use('/', userController.provideController());
    app.use('/', groupController.provideController());
    app.use('/', userGroupContoller.provideController());

    //default error handler
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        logger.warn(error.message);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    });

    app.listen(port, () => console.log(`server listens ${port} port`));
};
