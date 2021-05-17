import { Request, Response, Router } from 'express';
import { UserGroupService } from '../../serivces';
import { UsersGroupDTO } from '../../models';
import { Injectable } from '../../di';
import { ErrorLogger } from '../../decorators';
import { LoggerLevel } from '../../logger';

@Injectable()
export class UserGroupControllerProvider {
    constructor(private userGroupService: UserGroupService) {}

    @ErrorLogger(LoggerLevel.ERROR)
    public provideController(): Router {
        const controller = Router();

        controller.get('/users-group', this.getUsersWithGroups.bind(this));
        controller.post('/users-group', this.addUsersToGroup.bind(this));
        controller.get('/users-group/:id', this.getUserWithGroupsById.bind(this));

        return controller;
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async getUserWithGroupsById(req: Request, res: Response) {
        const userId = req.params.id;
        const userWithGroups = await this.userGroupService.getUserGroupsByPk(userId);

        res.json(userWithGroups);
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async getUsersWithGroups(req: Request, res: Response) {
        const usersWithGroups = await this.userGroupService.getUsersWithGroups();

        res.json(usersWithGroups);
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async addUsersToGroup(req: Request, res: Response) {
        const usersGroupDTO: UsersGroupDTO = req.body;

        const updatedUsers = await this.userGroupService.linkUsersAndGroup(usersGroupDTO);

        res.json(updatedUsers);
    }
}
