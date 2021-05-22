export interface DataAccess<T> {
    create(createBody: T): Promise<T>;
    get(): Promise<T[]>;
    getByPK(pk: string): Promise<T>;
    deleteByPK(pk: string): Promise<T>;
    updateByPK(pk: string, updateBody: Partial<T>): Promise<T>;
    getByField(field: string, substring: string, limit: number): Promise<T[]>;
}
