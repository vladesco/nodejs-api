import { AnyObject } from '../types';

export const noop = () => null;

export const stringify = (value: any) =>
    value && typeof value === 'object' ? JSON.stringify(value) : value;

export const transformFields = <T>(
    object: AnyObject,
    fn: (value: any) => T
): { [key: string]: ReturnType<typeof fn> } =>
    Object.entries(object).reduce((acc, [field, value]) => ({ ...acc, [field]: fn(value) }), {});
