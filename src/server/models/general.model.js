import {
    bookingByInvoices, byBookings, getBookingAgents, getTravelSubTypes,
} from '../queries/reports/general.queries';

export default class GeneralModel {
    async getInvoicesOfBookings({ startDate, endDate, conditions }) {
        const connection = await createDBConnection();

        let query = byBookings;

        if (startDate) {
            query += `AND i.issue_date BETWEEN '${startDate}' AND '${endDate || startDate}'`;
        } else if (endDate) {
            query += `AND i.issue_date BETWEEN '${endDate}' AND '${endDate}'`;
        }

        if (conditions) {
            query += `${conditions}`;
        }

        const bookingsWithConditions = await connection.query(query);

        const invoiceIds = [...new Set(bookingsWithConditions.rows.map((item) => item.invoice_id))];

        const result = await connection.query(bookingByInvoices, [invoiceIds]);

        closeDBConection(connection);

        return result.rows;
    }

    async getBookings({ startDate, endDate, conditions }) {
        const connection = await createDBConnection();

        let query = byBookings;

        if (startDate) {
            query += `AND i.issue_date BETWEEN '${startDate}' AND '${endDate || startDate}'`;
        } else if (endDate) {
            query += `AND i.issue_date BETWEEN '${endDate}' AND '${endDate}'`;
        }

        if (conditions) {
            query += `${conditions}`;
        }

        const result = await connection.query(query);

        closeDBConection(connection);

        return result.rows;
    }

    async getBookingsByInvoice({ invoiceId }) {
        const connection = await createDBConnection();
        const values = [[invoiceId]];
        const result = await connection.query(bookingByInvoices, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getBookingAgents({ bookingId }) {
        const connection = await createDBConnection();
        const values = [bookingId];
        const result = await connection.query(getBookingAgents, values);
        closeDBConection(connection);

        return result.rows;
    }

    async getTravelSubTypes() {
        const connection = await createDBConnection();
        const result = await connection.query(getTravelSubTypes);
        closeDBConection(connection);

        return result.rows;
    }

    async execQueryReport({
        startDate, endDate, conditions, reportQuery,
    }) {
        try {
            const connection = await createDBConnection();
            const execQuery = await this.getReport(reportQuery);
            let { query } = execQuery[0];

            query = query.replaceAll('--conditions', conditions || '');

            const values = [startDate, endDate];
            const result = await connection.query(query, values);
            closeDBConection(connection);

            return result.rows;
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        }
    }
}
