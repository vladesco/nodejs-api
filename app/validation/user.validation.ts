import Joi from 'joi';
import { ValidationSchema } from './types';
import { UserDTO } from '../models';

const userDTOSchema: ValidationSchema<UserDTO> = {
    login: Joi.string().min(5).max(20).required(),
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{5,15}$/)
        .required(),
    age: Joi.number().min(4).max(130).required(),
};

export const userDTOValidtor = Joi.object(userDTOSchema);
