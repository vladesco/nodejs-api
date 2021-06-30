import assert from 'assert';
import { SinonStub, stub } from 'sinon';
import { container, loggerToken } from '../../di';
import { UserDTO } from '../../models';
import { UserController } from '../../routes/controllers';
import { UserService } from '../../serivces';
import { WithId } from '../../types';

describe('user controller', () => {
    const testUser: UserDTO = {
        login: 'test login',
        password: 'test password',
        age: 0,
    };
    const testUsers: WithId<UserDTO>[] = [
        {
            id: 'test id',
            ...testUser,
        },
    ];

    let userServiceMock: { [key in keyof UserService]: SinonStub };
    let res: { json: SinonStub };

    beforeEach(() => {
        userServiceMock = {
            addUser: stub(),
            getUsers: stub(),
            getUserById: stub(),
            deleteUserById: stub(),
            updateUserById: stub(),
            getAutoSuggestUsers: stub(),
        };

        res = { json: stub() };

        container.provide(UserService, userServiceMock as any);
        container.provide(loggerToken, stub());
    });

    it('shuld return controller with correct routes', () => {
        const userController = container.resolve(UserController).provideController();
        const pathes = ['/users', '/users', '/users/list', '/users/:id', '/users/:id'];

        pathes.forEach((path) =>
            assert(userController.stack.find((routeInfo) => routeInfo.route.path.includes(path)))
        );
    });

    it('should call getUsers method and return correct response', async () => {
        const userController = container.resolve(UserController);

        userServiceMock.getUsers.resolves(testUsers);
        await (userController as any).getUsers(null, res);

        assert(userServiceMock.getUsers.calledOnce);
        assert(res.json.calledOnceWith(testUsers));
    });

    it('should call addUser method and return correct response', async () => {
        const userController = container.resolve(UserController);

        const req = {
            body: testUser,
        };

        userServiceMock.addUser.resolves(testUser);
        await (userController as any).addUser(req, res);

        assert(userServiceMock.addUser.calledOnceWith(testUser));
        assert(res.json.calledOnceWith(testUser));
    });

    it('should call getUserList method and return correct response', async () => {
        const userController = container.resolve(UserController);
        const subString = 'test query';
        const limit = '0';
        const req = {
            query: {
                subString,
                limit,
            },
        };

        userServiceMock.getAutoSuggestUsers.resolves(testUsers);
        await (userController as any).getUserList(req, res);

        assert(userServiceMock.getAutoSuggestUsers.calledOnceWith(subString, Number(limit)));
        assert(res.json.calledOnceWith(testUsers));
    });

    it('should call getUserById method and return correct response', async () => {
        const userController = container.resolve(UserController);
        const id = 'test id';
        const req = {
            params: {
                id,
            },
        };

        userServiceMock.getUserById.resolves(testUser);
        await (userController as any).getUserById(req, res);

        assert(userServiceMock.getUserById.calledOnceWith(id));
        assert(res.json.calledOnceWith(testUser));
    });

    it('should call deleteUserById method and return correct response', async () => {
        const userController = container.resolve(UserController);
        const id = 'test id';
        const req = {
            params: {
                id,
            },
        };

        userServiceMock.deleteUserById.resolves(testUser);
        await (userController as any).deleteUserById(req, res);

        assert(userServiceMock.deleteUserById.calledOnceWith(id));
        assert(res.json.calledOnceWith(testUser));
    });

    it('should call updateUserById method and return correct response', async () => {
        const userController = container.resolve(UserController);
        const id = 'test id';
        const req = {
            params: {
                id,
            },
            body: testUser,
        };

        userServiceMock.updateUserById.resolves(testUser);
        await (userController as any).updateUserById(req, res);

        assert(userServiceMock.updateUserById.calledOnceWith(id, testUser));
        assert(res.json.calledOnceWith(testUser));
    });
});
