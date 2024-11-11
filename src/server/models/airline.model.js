import {
    getAirCommissionByMothAndYear, getAirSalesByMothAndYear, getCityPairAirlines, getCityPairClientAirlines, getCityPairClients, getCityPairs,
} from '../queries/reports/airline.queries';

export default class AirlineModel {
    async getAirSalesByMothAndYear({ startDate, endDate, conditions }) {
        const connection = await createDBConnection();

        let query = getAirSalesByMothAndYear;

        query = query.replaceAll('--conditions', conditions || '');

        const values = [startDate, endDate];
        const result = await connection.query(query, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getAirCommissionByMothAndYear({ startDate, endDate, conditions }) {
        const connection = await createDBConnection();

        let query = getAirCommissionByMothAndYear;

        query = query.replaceAll('--conditions', conditions || '');

        const values = [startDate, endDate];
        const result = await connection.query(query, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getCityPairs({ startDate, endDate, conditions }) {
        const connection = await createDBConnection();

        let query = getCityPairs;

        query = query.replaceAll('--conditions', conditions || '');

        const values = [startDate, endDate];

        const result = await connection.query(query, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getCityPairProfiles({
        startDate, endDate, originCity, destinationCity, isClient,
    }) {
        const connection = await createDBConnection();

        const query = isClient ? getCityPairClients : getCityPairAirlines;

        const values = [startDate, endDate, originCity, destinationCity];

        const result = await connection.query(query, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getCityPairClientAirlines({
        startDate, endDate, originCity, destinationCity, clientId,
    }) {
        const connection = await createDBConnection();

        const query = getCityPairClientAirlines;

        const values = [startDate, endDate, originCity, destinationCity, clientId];

        const result = await connection.query(query, values);
        closeDBConection(connection);

        return result.rows;
    }
}
