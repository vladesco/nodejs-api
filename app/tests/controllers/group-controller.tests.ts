import assert from 'assert';
import { SinonStub, stub } from 'sinon';
import { container, loggerToken } from '../../di';
import { GroupWithPermissionsDTO } from '../../models';
import { GroupController } from '../../routes/controllers';
import { GroupService } from '../../serivces';

describe('group controller', () => {
    const testGroup: GroupWithPermissionsDTO = {
        name: 'test group',
        permissions: [{ name: 'READ' }],
    };
    const testGroups: GroupWithPermissionsDTO[] = [testGroup];

    let groupServiceMock: { [key in keyof GroupService]: SinonStub };
    let res: { json: SinonStub };

    beforeEach(() => {
        groupServiceMock = {
            getGroups: stub(),
            addGroup: stub(),
            getGroupById: stub(),
            updateGroupById: stub(),
            deleteGroupById: stub(),
        };

        res = { json: stub() };

        container.provide(GroupService, groupServiceMock as any);
        container.provide(loggerToken, stub());
    });

    it('shuld return controller with correct routes', () => {
        const groupController = container.resolve(GroupController).provideController();
        const pathes = ['/groups', '/groups/:id'];

        pathes.forEach((path) =>
            assert(groupController.stack.find((routeInfo) => routeInfo.route.path.includes(path)))
        );
    });

    it('should call getGroups method and return correct response', async () => {
        const groupController = container.resolve(GroupController);

        groupServiceMock.getGroups.resolves(testGroups);
        await (groupController as any).getGroups(null, res);

        assert(groupServiceMock.getGroups.calledOnce);
        assert(res.json.calledOnceWith(testGroups));
    });

    it('should call addGroup method and return correct response', async () => {
        const groupController = container.resolve(GroupController);

        const req = {
            body: testGroup,
        };

        groupServiceMock.addGroup.resolves(testGroup);
        await (groupController as any).addGroup(req, res);

        assert(groupServiceMock.addGroup.calledOnceWith(testGroup));
        assert(res.json.calledOnceWith(testGroup));
    });

    it('should call deleteGroupById method and return correct response', async () => {
        const groupController = container.resolve(GroupController);
        const id = 'test id';
        const req = {
            params: {
                id,
            },
        };

        groupServiceMock.deleteGroupById.resolves(testGroup);
        await (groupController as any).deleteGroupById(req, res);

        assert(groupServiceMock.deleteGroupById.calledOnceWith(id));
        assert(res.json.calledOnceWith(testGroup));
    });

    it('should call updateGroupById method and return correct response', async () => {
        const groupController = container.resolve(GroupController);
        const id = 'test id';
        const req = {
            params: {
                id,
            },
            body: testGroup,
        };

        groupServiceMock.updateGroupById.resolves(testGroup);
        await (groupController as any).updateGroupById(req, res);

        assert(groupServiceMock.updateGroupById.calledOnceWith(id, testGroup));
        assert(res.json.calledOnceWith(testGroup));
    });
});
