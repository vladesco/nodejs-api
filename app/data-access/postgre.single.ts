import { Op } from 'sequelize';
import { BaseModel } from '../models';
import { AnyObject, StaticMethods } from '../types';
import { DataAccess } from './types';

export class PostgreSingle<T extends AnyObject = {}> implements DataAccess<T> {
    constructor(private model: StaticMethods<typeof BaseModel>) {}

    public async create(createBody: T): Promise<T> {
        const record = await this.model.create(createBody);
        await record.save();

        return record as T;
    }

    public async get(): Promise<T[]> {
        return this.model.findAll() as Promise<T[]>;
    }

    public async getByPK(pk: string): Promise<T> {
        return this.model.findByPk(pk) as Promise<T>;
    }

    public async deleteByPK(pk: string): Promise<T> {
        const deletedRow = await this.model.findByPk(pk);
        await deletedRow?.destroy();

        return deletedRow as T;
    }

    public async updateByPK(pk: string, updateBody: Partial<T>): Promise<T> {
        const updatedRow = await this.model.findByPk(pk);
        await updatedRow?.update(updateBody);
        return updatedRow as T;
    }

    public async getByField(
        field: string,
        substring: string,
        limit: number
    ): Promise<T[]> {
        return this.model.findAll({
            limit,
            where: {
                [field]: {
                    [Op.substring]: substring,
                },
            },
        }) as Promise<T[]>;
    }
}
