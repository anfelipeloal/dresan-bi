import GeneralManager from '../Manager/general.manager';
import GeneralModel from '../models/general.model';

export default class GeneralController {
    async getInvoices({ startDate, endDate, conditions }) {
        const generalModel = new GeneralModel();
        const data = await generalModel.getInvoicesOfBookings({
            startDate,
            endDate,
            conditions,
        });

        const generalManager = new GeneralManager();
        const invoices = generalManager.getInvoices({ bookings: data });

        return invoices;
    }

    async getBookings({ startDate, endDate, conditions }) {
        const generalModel = new GeneralModel();
        const data = await generalModel.getBookings({
            startDate,
            endDate,
            conditions,
        });

        return data;
    }

    async getBookingsByInvoice({ invoiceId }) {
        const generalModel = new GeneralModel();
        const data = await generalModel.getBookingsByInvoice({
            invoiceId,
        });

        return data;
    }

    async getBookingAgents({ bookingId }) {
        const generalModel = new GeneralModel();
        const data = await generalModel.getBookingAgents({
            bookingId,
        });

        return data;
    }

    async getTravelSubTypes() {
        const generalModel = new GeneralModel();
        const data = await generalModel.getTravelSubTypes();

        return data;
    }

    async getTypeReport({ searchable }) {
        const generalModel = new GeneralModel();
        const data = await generalModel.getTypeReport({
            searchable,
        });

        return data;
    }

    async execQueryReport({
        startDate, endDate, conditions, reportQuery,
    }) {
        try {
            const generalModel = new GeneralModel();
            const data = await generalModel.execQueryReport({
                startDate,
                endDate,
                conditions,
                reportQuery,
            });

            return data;
        } catch (err) {
            return err;
        }
    }
}
