import { ManyToManyModel } from '../../models';
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

        await this.firstModel.linkEntity(this.secondModel, firstEntity, secondEntity);

        return firstEntity;
    }

    public async unlinkEntities(firstEntityPk: string, secondEntityPk: string): Promise<T> {
        const firstEntity = await this.firstModel.findByPk(firstEntityPk);
        const secondEntity = await this.secondModel.findByPk(secondEntityPk);

        await this.firstModel.unlinkEntity(this.secondModel, firstEntity, secondEntity);

        return firstEntity;
    }
}
