import express, { NextFunction, Request, Response } from 'express';
import { userController } from './routes/controllers';

export const app = express();

app.use(express.json());

app.use('/', userController);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400);
    res.send(err.message);
});