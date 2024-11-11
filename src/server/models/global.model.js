import { logger } from '../utils/logger';
import { getClients, getProfile, getVendors } from '../queries/reports/general.queries';

export default class GlobalModel {
    async getClients({ searchable }) {
        logger.info('-----------------CLIENTS-----------------');
        logger.info(`hora solicitud de conección: ${new Date()}`);
        const connection = await createDBConnection();
        if (connection) {
            logger.info(`hora coneccion realizada: ${new Date()}`);
        }
        const values = [`%${searchable}%`];
        logger.info(`hora solicitud de request: ${new Date()}`);
        const result = await connection.query(getClients, values);
        if (result) {
            logger.info(`hora de respuesta:${new Date()}`);
        }
        closeDBConection(connection);
        return result.rows;
    }

    async getProfileData({ id }) {
        const connection = await createDBConnection();

        const values = [id];
        const result = await connection.query(getProfile, values);
        closeDBConection(connection);
        return result.rows;
    }

    async getVendors({ searchable }) {
        logger.info('-----------------VENDORS-----------------');
        logger.info(`hora solicitud de conección: ${new Date()}`);
        const connection = await createDBConnection();
        if (connection) {
            logger.info(`hora coneccion realizada: ${new Date()}`);
        }
        const values = [`%${searchable}%`];
        logger.info(`hora solicitud de request: ${new Date()}`);
        const result = await connection.query(getVendors, values);
        if (result) {
            logger.info(`hora de respuesta:${new Date()}`);
        }
        closeDBConection(connection);
        return result.rows;
    }
}
