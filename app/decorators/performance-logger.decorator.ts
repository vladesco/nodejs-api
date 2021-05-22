import { container, loggerToken } from '../di';
import { LoggerLevel, LoggerMap } from '../logger';
import { isPromise } from '../utils';

export const PerformanceLogger = (level: LoggerLevel) => {
    return (target: object, propertyName: string, descriptor: PropertyDescriptor) => {
        const nativeMethod: Function = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const startOfFunctionExecution = new Date().getTime();
            const functionName = nativeMethod.name;
            const functionArguments = args;
            const logger = container.resolve<LoggerMap>(loggerToken)[level];

            const logPerformanceMessage = (endOfFunctionExecution: number) =>
                logger(
                    functionName,
                    'called with arguments',
                    functionArguments,
                    'took',
                    endOfFunctionExecution - startOfFunctionExecution,
                    'ms'
                );

            const methodResult = nativeMethod.apply(this, args);

            if (isPromise(methodResult)) {
                return methodResult.then((result) => {
                    logPerformanceMessage(new Date().getTime());
                    return result;
                });
            }

            logPerformanceMessage(new Date().getTime());
            return methodResult;
        };
    };
};
