declare module 'types' {
    export type WithId<T> = T & { id: string };
}

declare module 'express-async-errors' {}
