export type WithId<T> = T & { id: string };

type NonConstructorKeys<T> = {
    [P in keyof T]: T[P] extends new () => any ? never : P;
};

export type StaticMethods<T> = Pick<T, keyof NonConstructorKeys<T>> & {
    new (): any;
};

export type AnyObject = { [key: string]: any };
