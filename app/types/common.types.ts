export type WithId<T> = T & { id: string };

type NonConstructorKeys<T> = {
    [P in keyof T]: T[P] extends new () => any ? never : P;
};

export type StaticMethods<T> = Pick<T, keyof NonConstructorKeys<T>> & {
    new (): any;
};

export type PropertyType<T, K extends keyof T> = T[K];

export type AnyObject = { [key: string]: any };

export type Constructor<T> = { new (...args: any[]): T };

export type ClassDecorator<T> = (constructor: Constructor<T>) => void;

export type MethodDecorator = (
    target: object,
    propertyName: string,
    descriptor: PropertyDescriptor
) => void;

export type ParamDecorator = (target: object, paramKey: string, paramIndex: number) => void;
