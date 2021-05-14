import { Request, Response, Router } from 'express';
import { UserService } from '../../serivces';

export class UserControllerRrovider {
    constructor(private userService: UserService) {}

    public provideController(): Router {
        const controller = Router();

        controller.get('/users', this.getUsers);
        controller.post('/users', this.addUser);
        controller.get('/users/list', this.getUserList);
        controller.get('/users/:id', this.getUserById);
        controller.delete('/users/:id', this.deleteUserById);
        controller.put('/users/:id', this.updateUserById);

        return controller;
    }

    private getUsers = async (req: Request, res: Response) => {
        const users = await this.userService.getUsers();
        res.json(users);
    };

    private addUser = async (req: Request, res: Response) => {
        const userDTO = req.body;
        const addedUser = await this.userService.addUser(userDTO);
        res.json(addedUser);
    };

    private getUserList = async (req: Request, res: Response) => {
        const subString = req.query.subString as string;
        const limit = Number(req.query.limit);
        const users = await this.userService.getAutoSuggestUsers(
            subString,
            limit
        );

        res.json(users);
    };

    private getUserById = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const findedUser = await this.userService.getUserById(userId);
        res.json(findedUser);
    };

    private deleteUserById = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const findedUser = await this.userService.deletedUserById(userId);
        res.json(findedUser);
    };

    private updateUserById = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const userDTO = req.body;
        const updatedUser = await this.userService.updateUserById(
            userId,
            userDTO
        );
        res.json(updatedUser);
    };
}
