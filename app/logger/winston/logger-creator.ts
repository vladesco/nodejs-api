import { createLogger, transports, format } from 'winston';
import { stringify } from '../../utils';
import { LoggerLevel, LoggerMap } from '../types';

const prettyPrint = format.printf((info) => {
    const { label, level, message } = info;
    const splatKey = Symbol.for('splat');
    const splatData = info[splatKey as any];
    return `${level}: ${label}\n ${message} ${splatData.map(stringify).join(' ')}`;
});

export const getWinstonLogger: () => LoggerMap = () =>
    createLogger({
        level: LoggerLevel.DEBUG,
        format: format.combine(
            format.label({ label: 'message from custom logger' }),
            format.json(),
            prettyPrint
        ),
        transports: [new transports.Console()],
    });
