import { Request, Response, Router } from 'express';
import { GroupService } from '../../serivces';
import { GroupWithPermissionsDTO } from '../../types';

export class GroupControllerRrovider {
    constructor(private groupService: GroupService) {}

    public provideController(): Router {
        const controller = Router();

        controller.get('/groups', this.getGroups);
        controller.post('/groups', this.addGroup);
        controller.get('/groups/:id', this.getGroupById);
        controller.delete('/groups/:id', this.deleteGroupById);
        controller.put('/groups/:id', this.updateGroupById);

        return controller;
    }

    private getGroups = async (req: Request, res: Response) => {
        const users = await this.groupService.getGroups();
        res.json(users);
    };

    private addGroup = async (req: Request, res: Response) => {
        const groupDTO: GroupWithPermissionsDTO = req.body;
        const group = await this.groupService.createGroup(groupDTO);
        res.json(group);
    };

    private getGroupById = async (req: Request, res: Response) => {
        const groupId = req.params.id;
        const group = await this.groupService.getGroupById(groupId);

        res.json(group);
    };

    private updateGroupById = async (req: Request, res: Response) => {
        const groupId = req.params.id;
        const groupDTO: GroupWithPermissionsDTO = req.body;
        const updatedGroup = await this.groupService.updateGroupById(
            groupId,
            groupDTO
        );
        res.json(updatedGroup);
    };

    private deleteGroupById = async (req: Request, res: Response) => {
        const groupId = req.params.id;
        const deletedGroup = await this.groupService.deleteGroupById(groupId);
        res.json(deletedGroup);
    };
}
