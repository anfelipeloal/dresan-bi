import moment from 'moment';
import AirlineModel from '../models/airline.model';
import AirlineManager from '../Manager/airline.manager';

export default class AirlineController {
    async getAirSalesAnalysis({ conditions }) {
        const airlineModel = new AirlineModel();

        const firstDayOfLastYear = moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD');
        const lastDayOfPreviousMonth = moment().format('YYYY-MM-DD');

        const sales = await airlineModel.getAirSalesByMothAndYear({
            startDate: firstDayOfLastYear,
            endDate: lastDayOfPreviousMonth,
            conditions,
        });

        const totalSales = await airlineModel.getAirSalesByMothAndYear({
            startDate: firstDayOfLastYear,
            endDate: lastDayOfPreviousMonth,
            conditions: null,
        });

        const commissions = await airlineModel.getAirCommissionByMothAndYear({
            startDate: firstDayOfLastYear,
            endDate: lastDayOfPreviousMonth,
            conditions,
        });

        const totalCommissions = await airlineModel.getAirCommissionByMothAndYear({
            startDate: firstDayOfLastYear,
            endDate: lastDayOfPreviousMonth,
            conditions: null,
        });

        const airlineManager = new AirlineManager();
        const salesTransformedData = airlineManager.generateAirSalesReport(sales, totalSales, conditions);
        const commissionTransformedData = airlineManager.generateAirSalesReport(commissions, totalCommissions, conditions);

        return {
            sales: salesTransformedData,
            commissions: commissionTransformedData,
            conditions,
        };
    }

    async getCityPairsAnalysis({ startDate, endDate, conditions }) {
        const airlineModel = new AirlineModel();

        let data = await airlineModel.getCityPairs({
            startDate,
            endDate,
            conditions,
        });

        data = data.map((item) => ({
            ...item,
            query_conditions: {
                startDate,
                endDate,
            },
        }));

        return {
            cityPairs: data,
            conditions,
        };
    }

    async getCityPairDetail({
        startDate, endDate, originCity, destinationCity,
    }) {
        const airlineModel = new AirlineModel();

        let cityPairClients = await airlineModel.getCityPairProfiles({
            startDate,
            endDate,
            originCity,
            destinationCity,
            isClient: true,
        });

        const cityPairAirlines = await airlineModel.getCityPairProfiles({
            startDate,
            endDate,
            originCity,
            destinationCity,
            isClient: false,
        });

        cityPairClients = cityPairClients.map((item) => ({
            ...item,
            query_conditions: {
                startDate,
                endDate,
            },
        }));

        return {
            data: {
                cityPairClients,
                cityPairAirlines,
            },
            dateRage: {
                startDate,
                endDate,
            },
        };
    }

    async getCityPairClientAirlines({
        startDate, endDate, originCity, destinationCity, clientId,
    }) {
        const airlineModel = new AirlineModel();

        const data = await airlineModel.getCityPairClientAirlines({
            startDate,
            endDate,
            originCity,
            destinationCity,
            clientId,
        });

        return data;
    }
}
