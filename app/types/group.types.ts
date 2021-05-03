export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export type Group = {
    name: string;
};

export type GroupWithPermissionsDTO = Group & {
    permissions: { name: Permission }[];
};
