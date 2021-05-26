import Joi from 'joi';
import { UserCredetialsDTO } from '../models';
import { ValidationSchema } from './types';

const userCredentialsDTOSchema: ValidationSchema<UserCredetialsDTO> = {
    login: Joi.string().min(5).max(20).required(),
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{5,15}$/)
        .required(),
};

export const userCredentialsValidator = Joi.object(userCredentialsDTOSchema);
