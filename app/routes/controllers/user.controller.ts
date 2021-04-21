import { NextFunction, Request, Response, Router } from 'express';
import { BaseHttpError, HttpStatusCode } from '../../errors';
import { UserMapper } from '../../mappers';
import { UserRepository } from '../../repositories';
import { UserService } from '../../serivces';

export const userController = Router();

const userService = new UserService(new UserRepository(new UserMapper()));

userController.get('/users', async (req: Request, res: Response) => {
    const users = await userService.getUsers();
    res.json(users);
    res.end();
});

userController.post('/users', async (req: Request, res: Response) => {
    const userDTO = req.body;
    const addedUser = await userService.addUser(userDTO);
    res.json(addedUser);
    res.end();
});

userController.get('/users/list', async (req: Request, res: Response) => {
    const subString = req.query.subString as string;
    const limit = Number(req.query.limit);
    const users = await userService.getAutoSuggestUsers(subString, limit);

    res.json(users);
});

userController.get('/users/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;
    const findedUser = await userService.getUserById(userId);
    res.json(findedUser);
});

userController.delete('/users/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;
    const findedUser = await userService.deletedUserById(userId);
    res.json(findedUser);
});

userController.put('/users/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;
    const userDTO = req.body;
    const updatedUser = await userService.updateUserById(userId, userDTO);
    res.json(updatedUser);
});

userController.use(
    (error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof BaseHttpError) {
            res.status(error.errorCode);
            res.send(error.getMessage());
        } else {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR);
            res.send(error.message);
        }
    }
);
