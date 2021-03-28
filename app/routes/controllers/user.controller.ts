import { Request, Response, Router } from 'express';
import { UserMapper } from '../../mappers';
import { UserRepository } from '../../repositories';
import { UserService } from '../../serivces';

export const userController = Router();

const userService = new UserService(new UserRepository(new UserMapper()));

userController.post('/users/add', async (req: Request, res: Response) => {
    const userDTO = req.body;
    try {
        const addedUser = await userService.addUser(userDTO);
        res.json(addedUser);
        res.end();
    } catch (error) {
        res.status(401);
        res.send(error.message);
    }
});

userController.get('/users/get/:id', async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const findedUser = await userService.getUserById(userId);
        res.json(findedUser);
    } catch (error) {
        res.status(401);
        res.send(error.message);
    }
});

userController.delete(
    '/users/delete/:id',
    async (req: Request, res: Response) => {
        try {
            const userId = req.params.id;
            const findedUser = await userService.deletedUserById(userId);
            res.json(findedUser);
        } catch (error) {
            res.status(401);
            res.send(error.message);
        }
    }
);

userController.put('/users/update/:id', async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const userDTO = req.body;
        const updatedUser = await userService.updateUserById(userId, userDTO);
        res.json(updatedUser);
    } catch (error) {
        res.status(401);
        res.send(error.message);
    }
});

userController.get('/users/list/', async (req: Request, res: Response) => {
    try {
        const subString = req.query.subString as string;
        const limit = Number(req.query.limit);
        const updatedUser = await userService.getAutoSuggestUsers(
            subString,
            limit
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(401);
        res.send(error.message);
    }
});

userController.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await userService.getUsers();
        res.json(users);
        res.end();
    } catch (error) {
        res.status(401);
        res.send(error.message);
    }
});
