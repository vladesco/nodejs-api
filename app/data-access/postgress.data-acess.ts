import { Model, Op } from 'sequelize';

class PostgreModel extends Model {}

type Constructor<T> = Function & { prototype: T };
type PostgreType<T extends Constructor<Model>> = T;

export class PostgreDataAccess<
    U extends object,
    T extends PostgreType<typeof PostgreModel> = any
> {
    constructor(private _model: T) {}

    public async create(createBody: U): Promise<U> {
        const record: Model<U> = await this._model.create(createBody);
        await record.save();

        return record as U;
    }

    public async get(): Promise<U[]> {
        return this._model.findAll() as Promise<U[]>;
    }

    public async getByPK(pk: string): Promise<U> {
        return this._model.findByPk(pk) as Promise<U>;
    }

    public async deleteByPK(pk: string): Promise<U> {
        const deletedRow = await this._model.findByPk(pk);
        await deletedRow?.destroy();

        return deletedRow as U;
    }

    public async updateByPK(pk: string, updateBody: Partial<U>): Promise<U> {
        const updatedRow = await this._model.findByPk(pk);
        await updatedRow?.update(updateBody);
        return updatedRow as U;
    }

    public async getByField(
        field: string,
        substring: string,
        limit: number
    ): Promise<U[]> {
        return this._model.findAll({
            limit,
            where: {
                [field]: {
                    [Op.substring]: substring,
                },
            },
        }) as Promise<U[]>;
    }
}
