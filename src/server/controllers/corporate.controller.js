import CorporateManager from '../Manager/corporate.manager';
import CorporateModel from '../models/corporate.model';

export default class CorporateController {
    async getTravelType({ startDate, endDate }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getTravelType({
            startDate,
            endDate,
        });

        return data;
    }

    async getTravelTypeOthers({ startDate, endDate, primaryTravelTypes }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getTravelTypeOthers({
            startDate,
            endDate,
            primaryTravelTypes,
        });

        return data;
    }

    async getTravelSubType({ startDate, endDate }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getTravelSubType({
            startDate,
            endDate,
        });

        return data;
    }

    async getTravelSubTypeOthers({ startDate, endDate, primaryTravelTypes }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getTravelSubTypeOthers({
            startDate,
            endDate,
            primaryTravelTypes,
        });

        return data;
    }

    async getTotalSalesReportByBusinessUnit({ startDate, endDate }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getTotalSalesByBusinessUnit({
            startDate,
            endDate,
        });

        return data;
    }

    async getSalesByBusinessUnitHistory({ startDate, endDate }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getSalesByBusinessUnitHistory({
            startDate,
            endDate,
        });

        return data;
    }

    async getAirlinesProduction({ startDate, endDate, comparartiveColumns }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getAirlineProduction({
            startDate,
            endDate,
            comparartiveColumns,
        });

        return data;
    }

    async getAirlinesProductionDetail({ startDate, endDate, profileId }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getAirlineProductionDetail({
            startDate,
            endDate,
            profileId,
        });

        return data;
    }

    async getMajorAirlineProductionHistory({ startDate, endDate }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getMajorAirlineProductionHistoryData({
            startDate,
            endDate,
        });

        return data;
    }

    async getTopCustomers({ startDate, endDate }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getCustomersData({
            startDate,
            endDate,
        });

        return data;
    }

    async getTopCorporateCustomers({ startDate, endDate }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getCorporateCustomersData({
            startDate,
            endDate,
        });

        return data;
    }

    async getTaboolaReport({ startDate, endDate }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getTaboolaData({
            startDate,
            endDate,
        });

        return data;
    }

    async getTravelSummaryReport({ startDate, endDate, clientId }) {
        const corporateModel = new CorporateModel();
        const totalBookings = await corporateModel.getOBTAdoptionsTotals({
            startDate,
            endDate,
            clientId,
        });
        const onlineBookings = await corporateModel.getOBTAdoptionsOnline({
            startDate,
            endDate,
            clientId,
        });

        const corporateManager = new CorporateManager();
        const processedData = corporateManager.processOBTAdoptions(totalBookings, onlineBookings);

        return processedData;
    }

    async getTravelTypeSummary({ startDate, endDate }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getTravelTypeSummary({
            startDate,
            endDate,
        });

        return data;
    }

    async getTotalSalesReport({ startDate, endDate }) {
        const corporateModel = new CorporateModel();
        const data = await corporateModel.getTotalSales({
            startDate,
            endDate,
        });

        return data;
    }
}
