import { Model } from 'sequelize';
import { AnyObject } from '../../types';

export class BaseModel<T extends AnyObject = {}> extends Model<T> {
    public static getModelName(): string {
        const [modelName] = this.name.split('Model');
        return modelName;
    }

    public static getPrimaryKeyValue(entity: AnyObject): string {
        const primaryKey = this.primaryKeyAttribute;
        return entity[primaryKey];
    }
}

export class OneToOneModel<T extends AnyObject = {}> extends BaseModel<T> {
    public static async associateEntity(
        linkedModel: typeof BaseModel,
        mainEntity: BaseModel & AnyObject
    ): Promise<BaseModel> {
        const linkedModelName = linkedModel.getModelName();
        const getLinkedEntitiesFunctionName = `set${linkedModelName}`;

        return mainEntity[getLinkedEntitiesFunctionName]();
    }
}

export class OneToManyModel<T extends AnyObject = {}> extends BaseModel<T> {
    public static async getLinkedEntities(
        dependentModel: typeof BaseModel,
        mainEntity: BaseModel & AnyObject
    ): Promise<BaseModel[]> {
        const dependentModelName = dependentModel.getModelName();
        const getLinkedEntitiesFunctionName = `get${dependentModelName}s`;

        return mainEntity[getLinkedEntitiesFunctionName]();
    }

    public static createEntityandLink(
        dependentModel: typeof BaseModel,
        mainEntity: BaseModel & AnyObject,
        dependentEntityBody: AnyObject
    ): Promise<BaseModel> {
        const dependentModelName = dependentModel.getModelName();
        const setLinkedEntitiesFunctionName = `create${dependentModelName}`;

        return mainEntity[setLinkedEntitiesFunctionName](dependentEntityBody);
    }
}

export class ManyToManyModel<T extends AnyObject = {}> extends OneToManyModel<T> {
    public static async linkEntities(
        secondModel: typeof BaseModel,
        firstEntity: BaseModel & AnyObject,
        secondEntity: BaseModel & AnyObject
    ): Promise<BaseModel> {
        const linkedModelName = secondModel.getModelName();
        const addLinkedEntitiesFunctionName = `add${linkedModelName}`;

        return firstEntity[addLinkedEntitiesFunctionName](secondEntity);
    }

    public static async unlinkEntities(
        secondModel: typeof BaseModel,
        firstEntity: BaseModel & AnyObject,
        secondEntity: BaseModel & AnyObject
    ): Promise<BaseModel> {
        const linkedModelName = secondModel.getModelName();
        const addLinkedEntitiesFunctionName = `remove${linkedModelName}`;

        return firstEntity[addLinkedEntitiesFunctionName](secondEntity);
    }
}
