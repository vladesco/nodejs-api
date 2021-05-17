import { Request, Response, Router } from 'express';
import { ErrorLogger } from '../../decorators';
import { Injectable } from '../../di';
import { LoggerLevel } from '../../logger';
import { UserService } from '../../serivces';

@Injectable()
export class UserControllerRrovider {
    constructor(private userService: UserService) {}

    public provideController(): Router {
        const controller = Router();

        controller.get('/users', this.getUsers.bind(this));
        controller.post('/users', this.addUser.bind(this));
        controller.get('/users/list', this.getUserList.bind(this));
        controller.get('/users/:id', this.getUserById.bind(this));
        controller.delete('/users/:id', this.deleteUserById.bind(this));
        controller.put('/users/:id', this.updateUserById.bind(this));

        return controller;
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async getUsers(req: Request, res: Response) {
        const users = await this.userService.getUsers();
        res.json(users);
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async addUser(req: Request, res: Response) {
        const userDTO = req.body;
        const addedUser = await this.userService.addUser(userDTO);
        res.json(addedUser);
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async getUserList(req: Request, res: Response) {
        const subString = req.query.subString as string;
        const limit = Number(req.query.limit);
        const users = await this.userService.getAutoSuggestUsers(subString, limit);

        res.json(users);
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async getUserById(req: Request, res: Response) {
        const userId = req.params.id;
        const findedUser = await this.userService.getUserById(userId);
        res.json(findedUser);
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async deleteUserById(req: Request, res: Response) {
        const userId = req.params.id;
        const findedUser = await this.userService.deletedUserById(userId);
        res.json(findedUser);
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async updateUserById(req: Request, res: Response) {
        const userId = req.params.id;
        const userDTO = req.body;
        const updatedUser = await this.userService.updateUserById(userId, userDTO);
        res.json(updatedUser);
    }
}
