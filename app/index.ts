import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { HttpStatusCode } from './errors';
import { userController } from './routes/controllers';

export const app = express();

app.use(express.json());

app.use('/', userController);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR);
    res.send(err.message);
});
