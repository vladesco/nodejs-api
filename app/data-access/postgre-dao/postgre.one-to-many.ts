import { Op } from 'sequelize';
import { BaseModel, OneToManyModel } from '../../models';
import { AnyObject, StaticMethods } from '../../types';
import {
    excludeItemsFromSet,
    findIntersectionBetweenArrays,
    invert,
    transformFields,
} from '../../utils';
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
            },
        }) as Promise<T[]>;
    }

    public async deleteByPK(primaryKey: string): Promise<T> {
        const mainEntity = await this.mainModel.findByPk(primaryKey);
        await mainEntity?.destroy();

        return mainEntity as T;
    }

    public async create(mainEntityBody: T): Promise<T> {
        const mainEntity = await this.mainModel.create(mainEntityBody);
        const dependentEntityBodies = mainEntityBody[this.dependentModel.tableName];

        await Promise.all(
            dependentEntityBodies.map((dependentEntityBody: AnyObject) =>
                this.mainModel.createEntityAndLink(
                    this.dependentModel,
                    mainEntity,
                    dependentEntityBody
                )
            )
        );

        return this.getByPK(this.mainModel.getPrimaryKeyValue(mainEntity));
    }

    public async updateByPK(primaryKey: string, mainEntityBody: Partial<T>): Promise<T> {
        const mainEntity = await this.mainModel.findByPk(primaryKey);
        await mainEntity?.update(mainEntityBody);

        const dependentEntities = await this.mainModel.getLinkedEntities(
            this.dependentModel,
            mainEntity
        );
        const dependentEntityBodies = mainEntityBody[this.dependentModel.tableName] as any[];

        const comparator = (firstElem: AnyObject, secondElem: AnyObject) =>
            this.dependentModel.getPrimaryKeyValue(firstElem) ===
            this.dependentModel.getPrimaryKeyValue(secondElem);

        const createDependentEntityPromises = excludeItemsFromSet(
            dependentEntityBodies,
            dependentEntities,
            invert(comparator)
        ).map((dependentEntityBody) =>
            this.mainModel.createEntityAndLink(this.dependentModel, mainEntity, dependentEntityBody)
        );

        const deleteDependentEntityPromises = excludeItemsFromSet(
            dependentEntities,
            dependentEntityBodies,
            invert(comparator)
        ).map((dependentEntity) =>
            this.mainModel.unlinkEntity(this.dependentModel, mainEntity, dependentEntity)
        );

        const updateDependentEntityPromises = findIntersectionBetweenArrays(
            dependentEntities,
            dependentEntityBodies,
            comparator
        ).map(([dependentEntity, dependentEntityBody]) =>
            dependentEntity.update(dependentEntityBody)
        );

        await Promise.all<void | BaseModel>([
            ...createDependentEntityPromises,
            ...deleteDependentEntityPromises,
            ...updateDependentEntityPromises,
        ]);

        return this.getByPK(this.mainModel.getPrimaryKeyValue(mainEntity));
    }
}
