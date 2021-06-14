import { AnyObject } from '../types';

export const noop = () => null;

export const invert =
    (fc: (...args: any[]) => boolean): typeof fc =>
    (...args) =>
        !fc(...args);

export const stringify = (value: any) =>
    value && typeof value === 'object' ? JSON.stringify(value) : value;

export const transformFields = <T>(
    object: AnyObject,
    fn: (value: any) => T
): { [key: string]: ReturnType<typeof fn> } =>
    Object.entries(object).reduce((acc, [field, value]) => ({ ...acc, [field]: fn(value) }), {});

export const findIntersectionBetweenArrays = <T, U>(
    firstArray: T[],
    secondArray: U[],
    comparator: (elemFromFirstArray: T, elemFromSecondArray: U) => boolean
): [elemFromFirstArray: T, elemFromSecondArray: U][] => {
    const intersection: [elemFromFirstArray: T, elemFromSecondArray: U][] = [];

    firstArray.forEach((elemFromFirstArray) => {
        const elemFromSecondArray = secondArray.find((elemFromSecondArray) =>
            comparator(elemFromFirstArray, elemFromSecondArray)
        );

        if (elemFromSecondArray) {
            intersection.push([elemFromFirstArray, elemFromSecondArray]);
        }
    });

    return intersection;
};

export const excludeItemsFromSet = <T, U>(
    firstArray: T[],
    secondArray: U[],
    comparator: (elemFromFirstArray: T, elemFromSecondArray: U) => boolean
): T[] => {
    if (secondArray.length) {
        return firstArray.filter((elemFromFirstArray) =>
            secondArray.find((elemFromSecondArray) =>
                comparator(elemFromFirstArray, elemFromSecondArray)
            )
        );
    } else {
        return firstArray;
    }
};
