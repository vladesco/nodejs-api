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

        controller.get('/user-groups', this.getUsersWithGroups.bind(this));
        controller.post('/user-groups', this.addUsersToGroup.bind(this));
        controller.get('/user-groups/:id', this.getUserWithGroupsById.bind(this));

        return controller;
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async getUserWithGroupsById(req: Request, res: Response) {
        const userId = req.params.id;
        const userWithGroups = await this.userGroupService.getUserWithGroupsByPk(userId);

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

        const updatedUsers = await this.userGroupService.adaddUsersToGroup(usersGroupDTO);

        res.json(updatedUsers);
    }
}
