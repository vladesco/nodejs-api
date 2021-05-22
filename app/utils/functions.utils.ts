export const noop = () => null;
export const stringify = (value: any) =>
    value && typeof value === 'object' ? JSON.stringify(value) : value;
