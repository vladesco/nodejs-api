export const isPromise = <T>(
    possiblePromise: Promise<T> | any
): possiblePromise is Promise<T> => {
    return possiblePromise instanceof Promise;
};

export const isString = (
    possibleString: string | any
): possibleString is string => {
    return typeof possibleString === 'string';
};
