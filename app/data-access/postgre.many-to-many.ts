import { Op } from 'sequelize';
import { BaseModel } from '../models';
import { AnyObject, DataAccess, StaticMethods } from '../types';

export class PostgreManyToMany<T extends AnyObject = {}>
    implements DataAccess<T>
{
    constructor(
        private firstModel: StaticMethods<typeof BaseModel>,
        private secondModel: StaticMethods<typeof BaseModel>
    ) {}

    public async get(): Promise<T[]> {
        return this.firstModel.findAll({
            include: {
                model: this.secondModel,
                as: this.secondModel.tableName,
                through: {
                    attributes: [],
                },
            },
        }) as Promise<T[]>;
    }

    public async getByPK(primaryKey: string): Promise<T> {
        return this.firstModel.findOne({
            where: {
                [this.firstModel.primaryKeyAttribute]: primaryKey,
            },
            include: {
                model: this.secondModel,
                as: this.secondModel.tableName,
                through: {
                    attributes: [],
                },
            },
        }) as Promise<T>;
    }

    public async deleteByPK(primaryKey: string): Promise<T> {
        const model = await this.firstModel.findByPk(primaryKey);
        await model?.destroy();

        return model as T;
    }

    public async create(createBody: T): Promise<T> {
        const firstEntity = await this.firstModel.create(createBody);
        const linkedEntities = createBody[this.secondModel.tableName];

        await Promise.all(
            linkedEntities.map(async (linkedEntity: any) => {
                const secondEntity = await this.secondModel.findByPk(
                    this.secondModel.getPrimaryKeyValue(linkedEntity)
                );

                this.firstModel.addLinkedEntity(
                    firstEntity,
                    secondEntity,
                    this.secondModel
                );
            })
        );

        return firstEntity as T;
    }

    public async updateByPK(
        primaryKey: string,
        updateBody: Partial<T>
    ): Promise<T> {
        const updatedMainEntity = await this.firstModel.findByPk(primaryKey);
        await updatedMainEntity?.update(updateBody);

        const linkedEntities = await this.firstModel.getLinkedEntities(
            updatedMainEntity,
            this.secondModel
        );

        const updatedLinkedEntities = updateBody[
            this.secondModel.tableName
        ] as any[];

        await Promise.all(
            linkedEntities.map(async (linkedEntity) => {
                const updatedEntity = updatedLinkedEntities.find(
                    (updatedEntity) =>
                        this.secondModel.getPrimaryKeyValue(linkedEntity) ===
                        this.secondModel.getPrimaryKeyValue(updatedEntity)
                );

                if (updatedEntity) {
                    await linkedEntity.update(updatedEntity);
                } else {
                    await linkedEntity.destroy();
                }
            })
        );

        return updatedMainEntity as T;
    }

    public getByField(
        field: string,
        substring: string,
        limit: number
    ): Promise<T[]> {
        return this.firstModel.findAll({
            limit,
            where: {
                [field]: {
                    [Op.substring]: substring,
                },
            },
        }) as Promise<T[]>;
    }
}
