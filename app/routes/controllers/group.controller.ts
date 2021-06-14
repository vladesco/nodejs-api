import { Request, Response, Router } from 'express';
import { ErrorLogger } from '../../decorators';
import { Injectable } from '../../di';
import { LoggerLevel } from '../../logger';
import { GroupWithPermissionsDTO } from '../../models';
import { GroupService } from '../../serivces';

@Injectable()
export class GroupController {
    constructor(private groupService: GroupService) {}

    @ErrorLogger(LoggerLevel.ERROR)
    public provideController(): Router {
        const controller = Router();

        controller.get('/groups', this.getGroups.bind(this));
        controller.post('/groups', this.addGroup.bind(this));
        controller.get('/groups/:id', this.getGroupById.bind(this));
        controller.delete('/groups/:id', this.deleteGroupById.bind(this));
        controller.put('/groups/:id', this.updateGroupById.bind(this));

        return controller;
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async getGroups(req: Request, res: Response) {
        const users = await this.groupService.getGroups();
        res.json(users);
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async addGroup(req: Request, res: Response) {
        const groupDTO: GroupWithPermissionsDTO = req.body;
        const group = await this.groupService.createGroup(groupDTO);
        res.json(group);
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async getGroupById(req: Request, res: Response) {
        const groupId = req.params.id;
        const group = await this.groupService.getGroupById(groupId);

        res.json(group);
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async updateGroupById(req: Request, res: Response) {
        const groupId = req.params.id;
        const groupDTO: GroupWithPermissionsDTO = req.body;
        const updatedGroup = await this.groupService.updateGroupById(groupId, groupDTO);
        res.json(updatedGroup);
    }

    @ErrorLogger(LoggerLevel.ERROR)
    private async deleteGroupById(req: Request, res: Response) {
        const groupId = req.params.id;
        const deletedGroup = await this.groupService.deleteGroupById(groupId);
        res.json(deletedGroup);
    }
}
