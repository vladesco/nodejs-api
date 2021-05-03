import Joi from 'joi';
import { UsersGroupDTO, ValidationSchema } from '../types';

const usersGroupDTOSchema: ValidationSchema<UsersGroupDTO> = {
    userIds: Joi.array()
        .items(Joi.string().guid({ version: 'uuidv4' }))
        .required(),
    groupId: Joi.string().guid({ version: 'uuidv4' }),
};

export const usersGroupDTOValidtor = Joi.object(usersGroupDTOSchema);
