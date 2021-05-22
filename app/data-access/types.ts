import { AnyObject } from '../types';

export type SearchOptions = {
    limit: number;
    exact: boolean;
};
export interface DataAccess<T> {
    create(createBody: T): Promise<T>;
    get(): Promise<T[]>;
    getByPK(pk: string): Promise<T>;
    deleteByPK(pk: string): Promise<T>;
    updateByPK(pk: string, updateBody: Partial<T>): Promise<T>;
    getByFields(searchQuery: AnyObject, options: Partial<SearchOptions>): Promise<T[]>;
}

export interface OneToManyDataAccess<T> extends DataAccess<T> {}

export interface ManyToManyDataAccess<T> extends DataAccess<T> {
    linkEntities(firstEntityPk: string, secondEntityPk: string): Promise<T>;
    unlinkEntities(firstEntityPk: string, secondEntityPk: string): Promise<T>;
}
