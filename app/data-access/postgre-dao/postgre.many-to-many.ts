import { BaseModel, ManyToManyModel } from '../../models';
import { AnyObject, StaticMethods } from '../../types';
import { ManyToManyDataAccess } from '../types';
import { PostgreOneToMany } from './postgre.one-to-many';

export class PostgreManyToMany<T extends AnyObject = {}>
    extends PostgreOneToMany<T>
    implements ManyToManyDataAccess<T>
{
    constructor(
        private firstModel: StaticMethods<typeof ManyToManyModel>,
        private secondModel: StaticMethods<typeof ManyToManyModel>
    ) {
        super(firstModel, secondModel);
    }

    public async linkEntities(firstEntityPk: string, secondEntityPk: string): Promise<T> {
        const firstEntity = await this.firstModel.findByPk(firstEntityPk);
        const secondEntity = await this.secondModel.findByPk(secondEntityPk);

        await this.linkEntity(firstEntity, secondEntity);

        return firstEntity;
    }

    public async unlinkEntities(firstEntityPk: string, secondEntityPk: string): Promise<T> {
        const firstEntity = await this.firstModel.findByPk(firstEntityPk);
        const secondEntity = await this.secondModel.findByPk(secondEntityPk);

        await this.unlinkEntity(firstEntity, secondEntity);

        return firstEntity;
    }

    protected async linkEntityByBody(
        firstEntity: BaseModel,
        secondEntityBody: AnyObject
    ): Promise<BaseModel> {
        let secondEntity = await this.secondModel.findByPk(
            this.secondModel.getPrimaryKeyValue(secondEntityBody)
        );

        if (!secondEntity) {
            secondEntity = await this.secondModel.create(secondEntityBody);
        }

        return this.firstModel.linkEntities(this.secondModel, firstEntity, secondEntity);
    }

    protected async removeEntity(firstEntity: BaseModel, secondEntity: BaseModel): Promise<T> {
        return this.unlinkEntities(
            this.firstModel.getPrimaryKeyValue(firstEntity),
            this.secondModel.getPrimaryKeyValue(secondEntity)
        );
    }

    protected async linkEntity(
        firstEntity: BaseModel,
        secondEntity: BaseModel
    ): Promise<BaseModel> {
        return this.firstModel.linkEntities(this.secondModel, firstEntity, secondEntity);
    }

    protected async unlinkEntity(
        firstEntity: BaseModel,
        secondEntity: BaseModel
    ): Promise<BaseModel> {
        return this.firstModel.unlinkEntities(this.secondModel, firstEntity, secondEntity);
    }
}
