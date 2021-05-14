import { Model } from 'sequelize';
import { AnyObject } from '../types';

export class BaseModel<T extends AnyObject = {}> extends Model<T> {
    public static async getLinkedEntities(
        mainEntity: BaseModel,
        linkedModel: typeof BaseModel
    ): Promise<BaseModel[]> {
        const [modelName] = linkedModel.name.split('Model');
        const getLinkedEntitiesFunctionName = `get${modelName}s`;

        return (mainEntity as any)[getLinkedEntitiesFunctionName]();
    }

    public static async addLinkedEntity(
        mainEntity: BaseModel,
        linkedEntity: any,
        linkedModel: typeof BaseModel
    ): Promise<BaseModel> {
        const [modelName] = linkedModel.name.split('Model');
        const addLinkedEntitiesFunctionName = `add${modelName}`;

        return (mainEntity as any)[addLinkedEntitiesFunctionName](linkedEntity);
    }

    public static getPrimaryKeyValue(entity: any): string {
        const primaryKey = this.primaryKeyAttribute;
        return entity[primaryKey];
    }
}
