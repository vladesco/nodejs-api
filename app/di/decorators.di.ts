import 'reflect-metadata';
import { ParamDecorator, ClassDecorator } from '../types';

export const Injectable: <T = any>() => ClassDecorator<T> = () => {
    return (target) => {
        const metadata = Reflect.getMetadata('design:paramtypes', target);
        if (!metadata) {
            throw new Error(`metadata for ${target.name} is not defined`);
        }
    };
};

export const Inject: (token: string) => ParamDecorator =
    (token) => (target, paramKey, paramIndex) => {
        const params = Reflect.getMetadata('design:paramtypes', target);
        params[paramIndex] = token;
    };
