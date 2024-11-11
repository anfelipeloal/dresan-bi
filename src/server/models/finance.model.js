import {
    budgetCostOfSales,
    budgetSales,
    byBusinessUnitEarningsAndCost,
    byBusinessUnitEarningsAndCostDetailed,
    byTotalSalesReport,
    getTotalSalesByMothAndYear,
    salesCurrentMonth,
    salesCurrentMonthDetailded,
} from '../queries/reports/finance.queries';

export default class FinanceModel {
    async getSalesCurrentMonth({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(salesCurrentMonth, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getBudgetSales({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(budgetSales, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getBudgetCostOfSales({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(budgetCostOfSales, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getSalesCurrentMonthDetailed({ startDate, endDate, serviceSubTypeId }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate, serviceSubTypeId];
        const result = await connection.query(salesCurrentMonthDetailded, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getSalesByBusinessUnitEarningsAndCost({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(byBusinessUnitEarningsAndCost, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getSalesByBusinessUnitEarningsAndCostDetailed({ startDate, endDate, serviceSubTypeId }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate, serviceSubTypeId];
        const result = await connection.query(byBusinessUnitEarningsAndCostDetailed, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getTotalSalesByMothAndYear({ startDate, endDate, businessUnit }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate, businessUnit];
        const result = await connection.query(getTotalSalesByMothAndYear, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getTotalSalesReport({ startDate, endDate }) {
        const connection = await createDBConnection();
        const values = [startDate, endDate];
        const result = await connection.query(byTotalSalesReport, values);
        closeDBConection(connection);

        return result.rows;
    }
}
