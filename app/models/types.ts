import { WithId } from '../types';

export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export type Group = {
    name: string;
};

export type GroupWithPermissionsDTO = Group & {
    permissions: { name: Permission }[];
};

export type UserDTO = {
    login: string;
    age: number;
    password: string;
};

export type userCredetialsDTO = {
    login: string;
    password: string;
};

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
