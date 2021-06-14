import Joi from 'joi';
import { GroupWithUsersDTO } from '../models';
import { ValidationSchema } from './types';

const GroupWithUsersDTOSchema: ValidationSchema<GroupWithUsersDTO> = {
    userIds: Joi.array()
        .items(Joi.string().guid({ version: 'uuidv4' }))
        .required(),
    groupId: Joi.string().guid({ version: 'uuidv4' }),
};

export const GroupWithUsersDTOValidtor = Joi.object(GroupWithUsersDTOSchema);
