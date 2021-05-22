import 'reflect-metadata';
import { Constructor } from '../types';
import { isString } from '../utils';

class Container {
    public resolve<T>(token: Constructor<T> | string): T {
        const providedValue = this.getProvidedValue(token);

        if (providedValue) {
            return providedValue;
        } else if (!isString(token)) {
            const params: any[] = Reflect.getMetadata('design:paramtypes', token);

            const instances = params.filter(Boolean).map((param) => this.resolve(param));

            return new token(...instances);
        } else {
            throw new Error(`dependency injection error for ${token}`);
        }
    }

    public provide<T = object>(token: Constructor<T> | string, object: T): void {
        Reflect.defineMetadata(token, object, this);
    }

    private getProvidedValue<T = object>(token: Constructor<T> | string): T {
        return Reflect.getMetadata(token, this);
    }
}

export const container = new Container();
