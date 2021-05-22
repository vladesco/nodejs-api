import { container, loggerToken } from '../di';
import { LoggerLevel, LoggerMap } from '../logger';
import { isPromise } from '../utils';

export const ErrorLogger = (level: LoggerLevel) => {
    return (target: object, propertyName: string, descriptor: PropertyDescriptor) => {
        const nativeMethod: Function = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const logger = container.resolve<LoggerMap>(loggerToken)[level];
            const functionName = nativeMethod.name;

            const logError = (error: Error) =>
                logger(functionName, 'error occured:', error.message);

            try {
                const methodResult = nativeMethod.apply(this, args);
                if (isPromise(methodResult)) {
                    return methodResult.catch((error) => {
                        logError(error);
                        throw error;
                    });
                } else {
                    return methodResult;
                }
            } catch (error) {
                logError(error);
                throw error;
            }
        };
    };
};
