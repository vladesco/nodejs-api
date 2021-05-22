import Joi from 'joi';
import { GroupWithPermissionsDTO } from '../models';
import { ValidationSchema } from './types';

const groupWithPermissionsDTOSchema: ValidationSchema<GroupWithPermissionsDTO> = {
    name: Joi.string().max(50).required(),
    permissions: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().max(20),
            })
        )
        .required(),
};

export const groupWithPermissionsDTOValidtor = Joi.object(groupWithPermissionsDTOSchema);
