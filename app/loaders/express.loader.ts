import express, { NextFunction, Response, Request, Router } from 'express';
import { PostgreManyToMany, PostgreSingle } from '../data-access';
import { HttpStatusCode } from '../errors';
import {
    GroupModel,
    PermissionModel,
    UserGroupModel,
    UserModel,
} from '../models';
import {
    GroupControllerRrovider,
    UserControllerRrovider,
    UserGroupControllerProvider,
} from '../routes/controllers';
import { GroupService, UserGroupService, UserService } from '../serivces';
import {
    GroupWithPermissionsDTO,
    UserDTO,
    UserGroupDTO,
    UserWithGroupsDTO,
    WithId,
} from '../types';

export const setupExpress = async (port: number) => {
    const app = express();
    const userController = createUserController();
    const groupController = createGroupController();
    const userGroupContoller = createUserGroupController();

    app.use(express.json());
    app.use('/', userController);
    app.use('/', groupController);
    app.use('/', userGroupContoller);

    //default error handler
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    });

    app.listen(port, () => console.log(`server listens ${port} port`));
};

function createUserController(): Router {
    const userAccessService = new PostgreSingle<WithId<UserDTO>>(UserModel);
    const userService = new UserService(userAccessService);
    const userControllerProvider = new UserControllerRrovider(userService);

    return userControllerProvider.provideController();
}

function createGroupController(): Router {
    const groupAccessService = new PostgreManyToMany<
        WithId<GroupWithPermissionsDTO>
    >(GroupModel, PermissionModel);
    const groupService = new GroupService(groupAccessService);
    const groupControllerProvider = new GroupControllerRrovider(groupService);

    return groupControllerProvider.provideController();
}

function createUserGroupController(): Router {
    const userGroupAccessService = new PostgreManyToMany<UserWithGroupsDTO>(
        UserModel,
        GroupModel
    );
    const linkingUserAndGroupAccessService = new PostgreSingle<UserGroupDTO>(
        UserGroupModel
    );
    const userGroupService = new UserGroupService(
        userGroupAccessService,
        linkingUserAndGroupAccessService
    );
    const userGroupControllerProvider = new UserGroupControllerProvider(
        userGroupService
    );

    return userGroupControllerProvider.provideController();
}
