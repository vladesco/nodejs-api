import express, { NextFunction, Response, Request } from 'express';
import { Config } from '../config';
import { configToken, container, loggerToken } from '../di';

import { HttpStatusCode } from '../errors';
import { LoggerMap } from '../logger';
import {
    GroupControllerRrovider,
    UserControllerRrovider,
    UserGroupControllerProvider,
} from '../routes/controllers';

export const setupExpress = async () => {
    const app = express();

    const { port } = container.resolve<Config>(configToken);
    const logger = container.resolve<LoggerMap>(loggerToken);

    const userControllerProvider = container.resolve(UserControllerRrovider);
    const groupControllerProvider = container.resolve(GroupControllerRrovider);
    const userGroupContollerProvider = container.resolve(UserGroupControllerProvider);

    app.use(express.json());
    app.use('/', userControllerProvider.provideController());
    app.use('/', groupControllerProvider.provideController());
    app.use('/', userGroupContollerProvider.provideController());

    //default error handler
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        logger.warn(error.message);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    });

    app.listen(port, () => console.log(`server listens ${port} port`));
};
