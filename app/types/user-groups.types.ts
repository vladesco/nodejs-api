import { Group } from './group.types';
import { WithId } from './helpers.types';
import { UserDTO } from './user.types';

export type UserWithGroupsDTO = WithId<UserDTO> & {
    groups: WithId<Group>[];
};

export type UserGroupDTO = {
    userId: string;
    groupId: string;
};

export type UsersGroupDTO = {
    userIds: string[];
    groupId: string;
};
