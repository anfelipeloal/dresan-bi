import { createLogger, format, transports } from 'winston';

export const logger = createLogger({

    level: 'info',
    format: format.simple(),
    transports: [

        new transports.Console({
            level: 'debug',
            format: format.simple(),
        }),

        new transports.File({
            filename: 'error.log',
            level: 'error',
        }),

        new transports.File({
            filename: 'combined.log',
        }),

    ],

});
