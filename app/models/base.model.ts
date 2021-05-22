import { Model } from 'sequelize';
import { AnyObject } from '../types';

export class BaseModel<T extends AnyObject = {}> extends Model<T> {
    public static async getLinkedEntities(
        mainEntity: BaseModel & AnyObject,
        linkedModel: typeof BaseModel
    ): Promise<BaseModel[]> {
        const [modelName] = linkedModel.name.split('Model');
        const getLinkedEntitiesFunctionName = `get${modelName}s`;

        return mainEntity[getLinkedEntitiesFunctionName]();
    }

    public static async addLinkedEntity(
        mainEntity: BaseModel & AnyObject,
        linkedEntity: AnyObject,
        linkedModel: typeof BaseModel
    ): Promise<BaseModel> {
        const [modelName] = linkedModel.name.split('Model');
        const addLinkedEntitiesFunctionName = `add${modelName}`;

        return mainEntity[addLinkedEntitiesFunctionName](linkedEntity);
    }

    public static getPrimaryKeyValue(entity: AnyObject): string {
        const primaryKey = this.primaryKeyAttribute;
        return entity[primaryKey];
    }
}
