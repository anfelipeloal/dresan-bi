import pgClient from 'pg';

const { Client } = pgClient;

export async function createDBConnection() {
    const config = useRuntimeConfig();

    const client = new Client({
        user: config.rsUser,
        host: config.rsHost,
        database: config.rsDatabase,
        password: config.rsPassword,
        port: config.rsPort,
    });

    await client.connect();

    return client;
}

export async function closeDBConection(client) {
    await client.end();
}
