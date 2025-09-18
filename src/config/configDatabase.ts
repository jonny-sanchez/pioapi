const ENV:any = process.env

export type ConnectionName = keyof typeof configDatabase

export const DEFAULT_CONNECTION:ConnectionName = 'PIOAPP'

export const configDatabase = {
    PIOAPP: {
        database: ENV.DB_DATABASE as string,
        username: ENV.DB_USERNAME as string,
        password: ENV.DB_PASSWORD as string,
        options: {
            host: ENV.DB_HOST as string,
            port: ENV.DB_PORT,
            dialect: ENV.DB_CONNECTION
        }
    },
    NOMINA: {
        database: ENV.DB_SECOND_DATABASE as string,
        username: ENV.DB_SECOND_USERNAME as string,
        password: ENV.DB_SECOND_PASSWORD as string,
        options: {
            host: ENV.DB_SECOND_HOST as string,
            port: ENV.DB_SECOND_PORT,
            dialect: ENV.DB_SECOND_CONNECTION
        }
    },
    GRUPOPINULITO: {
        database: ENV.DB_THIRD_DATABASE as string,
        username: ENV.DB_THIRD_USERNAME as string,
        password: ENV.DB_THIRD_PASSWORD as string,
        options: {
            host: ENV.DB_THIRD_HOST as string,
            port: ENV.DB_THIRD_PORT,
            dialect: ENV.DB_THIRD_CONNECTION
        }
    },
    PDV: {
        database: ENV.DB_FOURTH_DATABASE as string,
        username: ENV.DB_FOURTH_USERNAME as string,
        password: ENV.DB_FOURTH_PASSWORD as string,
        options: {
            host: ENV.DB_FOURTH_HOST as string,
            port: ENV.DB_FOURTH_PORT,
            dialect: ENV.DB_FOURTH_CONNECTION
        }
    }
}