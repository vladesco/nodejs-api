import { Request, Response, Router } from 'express';
import { UserGroupService } from '../../serivces';
import { UsersGroupDTO } from '../../types';

export class UserGroupControllerProvider {
    constructor(private userGroupService: UserGroupService) {}

    public provideController(): Router {
        const controller = Router();

        controller.get('/users-group', this.getUsersWithGroups);
        controller.post('/users-group', this.addUsersToGroup);
        controller.get('/users-group/:id', this.getUserWithGroupsById);

        return controller;
    }

    private getUserWithGroupsById = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const userWithGroups = await this.userGroupService.getUserGroupsByPk(
            userId
        );

        res.json(userWithGroups);
    };

    private getUsersWithGroups = async (req: Request, res: Response) => {
        const usersWithGroups =
            await this.userGroupService.getUsersWithGroups();

        res.json(usersWithGroups);
    };

    private addUsersToGroup = async (req: Request, res: Response) => {
        const usersGroupDTO: UsersGroupDTO = req.body;

        const updatedUsers = await this.userGroupService.linkUsersAndGroup(
            usersGroupDTO
        );

        res.json(updatedUsers);
    };
}
