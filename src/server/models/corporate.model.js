import {
    byAirlinesProduction,
    byAirlinesProductionDetail,
    byBusinessUnit,
    byBusinessUnitHistory,
    byMajorAirlineProduction,
    byTravelSubTypeOther, byTravelSubTypeTop, byTravelTypeOther, byTravelTypeTop, getOBTAdoptionsOnline, getOBTAdoptionsTotals,
    taboolaReport,
    topCorporateCustomers,
} from '../queries/reports/corporate.queries';
import { byTotalSales, byTravelTypeSummaryQuery } from '../queries/salesActivity.queries';

export default class CorporateModel {
    async getTravelType({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(byTravelTypeTop, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getTravelTypeOthers({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(byTravelTypeOther, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getTravelSubType({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(byTravelSubTypeTop, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getTravelSubTypeOthers({ startDate, endDate }) {
        const connection = await createDBConnection();

        const values = [startDate, endDate];
        const result = await connection.query(byTravelSubTypeOther, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getTotalSalesByBusinessUnit({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(byBusinessUnit, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getSalesByBusinessUnitHistory({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(byBusinessUnitHistory, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getAirlineProduction({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(byAirlinesProduction, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getAirlineProductionDetail({ startDate, endDate, profileId }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate, profileId];
        const result = await connection.query(byAirlinesProductionDetail, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getMajorAirlineProductionHistoryData({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(byMajorAirlineProduction, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getCustomersData({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(topCorporateCustomers, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getCorporateCustomersData({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(topCorporateCustomers, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getTaboolaData({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(taboolaReport, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getOBTAdoptionsTotals({ startDate, endDate, clientId }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate, clientId];
        const result = await connection.query(getOBTAdoptionsTotals, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getOBTAdoptionsOnline({ startDate, endDate, clientId }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate, clientId];
        const result = await connection.query(getOBTAdoptionsOnline, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getTravelTypeSummary({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(byTravelTypeSummaryQuery, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getTotalSales({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(byTotalSales, values);
        closeDBConection(connection);

        return result.rows;
    }
}
