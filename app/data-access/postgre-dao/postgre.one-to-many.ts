import { Op } from 'sequelize';
import { BaseModel, OneToManyModel } from '../../models';
import { AnyObject, StaticMethods } from '../../types';
import { transformFields } from '../../utils';
import { OneToManyDataAccess, SearchOptions } from '../types';

export class PostgreOneToMany<T extends AnyObject = {}> implements OneToManyDataAccess<T> {
    constructor(
        private mainModel: StaticMethods<typeof OneToManyModel>,
        private dependentModel: StaticMethods<typeof BaseModel>
    ) {}

    public async get(): Promise<T[]> {
        return this.mainModel.findAll({
            include: {
                model: this.dependentModel,
                as: this.dependentModel.tableName,
                through: {
                    attributes: [],
                },
            },
        }) as Promise<T[]>;
    }

    public async getByPK(primaryKey: string): Promise<T> {
        return this.mainModel.findOne({
            where: {
                [this.mainModel.primaryKeyAttribute]: primaryKey,
            },
            include: {
                model: this.dependentModel,
                as: this.dependentModel.tableName,
                through: {
                    attributes: [],
                },
            },
        }) as Promise<T>;
    }

    public async getByFields(
        searchQuery: AnyObject,
        { limit, exact }: Partial<SearchOptions>
    ): Promise<T[]> {
        const query = exact
            ? searchQuery
            : transformFields(searchQuery, (value) => ({ [Op.like]: value }));

        return this.mainModel.findAll({
            limit,
            where: query,
            include: {
                model: this.dependentModel,
                as: this.dependentModel.tableName,
                through: {
                    attributes: [],
                },
            },
        }) as Promise<T[]>;
    }

    public async deleteByPK(primaryKey: string): Promise<T> {
        const mainEntity = await this.mainModel.findByPk(primaryKey);
        await mainEntity?.destroy();

        return mainEntity as T;
    }

    public async create(createBody: T): Promise<T> {
        const mainEntity = await this.mainModel.create(createBody);
        const dependentEntitiesBody = createBody[this.dependentModel.tableName];

        await Promise.all(
            dependentEntitiesBody.map((dependentEntityBody: AnyObject) =>
                this.linkEntityByBody(mainEntity, dependentEntityBody)
            )
        );

        return this.getByPK(this.mainModel.getPrimaryKeyValue(mainEntity));
    }

    public async updateByPK(primaryKey: string, updateBody: Partial<T>): Promise<T> {
        const mainEntity = await this.mainModel.findByPk(primaryKey);
        await mainEntity?.update(updateBody);

        const dependentEntities = await this.getLinkedEntities(mainEntity);
        const dependentEntitiesBody = updateBody[this.dependentModel.tableName] as any[];

        const updatedDependentEntitiesPromises: Promise<BaseModel>[] = [];
        const deletedDependentEntitiestiesPromises: Promise<void>[] = [];

        dependentEntities.forEach((dependentEntity) => {
            const body = dependentEntitiesBody.find(
                (entityBody) =>
                    this.dependentModel.getPrimaryKeyValue(entityBody) ===
                    this.dependentModel.getPrimaryKeyValue(dependentEntity)
            );
            if (body) {
                updatedDependentEntitiesPromises.push(dependentEntity.update(body));
            } else {
                deletedDependentEntitiestiesPromises.push(dependentEntity.destroy());
            }
        });

        const createdDependentEntitiesPromises = dependentEntitiesBody
            .filter((entityBody) =>
                dependentEntities.find(
                    (dependentEntity) =>
                        this.dependentModel.getPrimaryKeyValue(entityBody) !==
                        this.dependentModel.getPrimaryKeyValue(dependentEntity)
                )
            )
            .map((entityBody) => this.linkEntityByBody(mainEntity, entityBody));

        const awaitedPromises: Promise<BaseModel | void>[] = [
            ...updatedDependentEntitiesPromises,
            ...createdDependentEntitiesPromises,
            ...deletedDependentEntitiestiesPromises,
        ];

        await Promise.all(awaitedPromises);

        return mainEntity as T;
    }

    protected async linkEntityByBody(
        mainEntity: BaseModel,
        dependentEntityBody: AnyObject
    ): Promise<BaseModel> {
        return this.mainModel.createEntityandLink(
            this.dependentModel,
            mainEntity,
            dependentEntityBody
        );
    }

    protected async getLinkedEntities(mainEntity: BaseModel): Promise<BaseModel[]> {
        return this.mainModel.getLinkedEntities(this.dependentModel, mainEntity);
    }

    protected async removeEntity(mainEntity: BaseModel, dependentEntity: BaseModel): Promise<T> {
        await dependentEntity.destroy();

        return this.getByPK(this.mainModel.getPrimaryKeyValue(mainEntity));
    }
}
