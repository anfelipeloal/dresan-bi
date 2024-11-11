import moment from 'moment';
import FinanceManager from '../Manager/finance.manager';
import FinanceModel from '../models/finance.model';

export default class FinanceController {
    async getSalesCurrentMonth({ previusDayReportDates, monthReportDates, yearReportDates }) {
        const financeModel = new FinanceModel();

        // get DTD
        const previusDayReport = await financeModel.getSalesCurrentMonth(JSON.parse(previusDayReportDates));

        // get MTD
        const monthReport = await financeModel.getSalesCurrentMonth(JSON.parse(monthReportDates));

        const monthBudgetSales = await financeModel.getBudgetSales(JSON.parse(monthReportDates));
        const monthBudgetCostOfSales = await financeModel.getBudgetCostOfSales(JSON.parse(monthReportDates));

        // get YTD
        const yearReport = await financeModel.getSalesCurrentMonth(JSON.parse(yearReportDates));

        const yearBudgetSales = await financeModel.getBudgetSales(JSON.parse(yearReportDates));
        const yearBudgetCostOfSales = await financeModel.getBudgetCostOfSales(JSON.parse(yearReportDates));

        const financeManager = new FinanceManager();

        const monthBudget = financeManager.combinateBudgetReports({
            budgetSales: monthBudgetSales,
            budgetCostOfSales: monthBudgetCostOfSales,
        });

        const yearBudget = financeManager.combinateBudgetReports({
            budgetSales: yearBudgetSales,
            budgetCostOfSales: yearBudgetCostOfSales,
        });

        const data = financeManager.combinateReports({
            previusDayReportParam: previusDayReport,
            monthReportParam: monthReport,
            yearReportParam: yearReport,
            monthBudget,
            yearBudget,
        });

        return data;
    }

    async getSalesCurrentMonthDetailed({ startDate, endDate, serviceSubTypeId }) {
        const financeModel = new FinanceModel();
        const data = await financeModel.getSalesCurrentMonthDetailed({
            startDate,
            endDate,
            serviceSubTypeId,
        });

        return data;
    }

    async getSalesByBusinessUnitEarningsAndCost({ startDate, endDate }) {
        const financeModel = new FinanceModel();
        const data = await financeModel.getSalesByBusinessUnitEarningsAndCost({
            startDate,
            endDate,
        });
        const financeManager = new FinanceManager();
        const transformedData = financeManager.getTopByCategoryAndCreatingOthers({ dataParam: data });

        return transformedData;
    }

    async getSalesByBusinessUnitEarningsAndCostDetailed({ startDate, endDate, serviceSubTypeId }) {
        const financeModel = new FinanceModel();
        const data = await financeModel.getSalesByBusinessUnitEarningsAndCostDetailed({
            startDate,
            endDate,
            serviceSubTypeId,
        });

        return data;
    }

    async getClientPerformance({ businessUnit }) {
        const financeModel = new FinanceModel();

        const firstDayOfLastYear = moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD');
        const lastDayOfPreviousMonth = moment().format('YYYY-MM-DD');

        const data = await financeModel.getTotalSalesByMothAndYear({
            startDate: firstDayOfLastYear,
            endDate: lastDayOfPreviousMonth,
            businessUnit,
        });

        const financeManager = new FinanceManager();
        const transformedData = financeManager.generateClientPerformanceReport({ data });

        return transformedData;
    }

    async getTotalSales({ startDate, endDate }) {
        const financeModel = new FinanceModel();
        const data = await financeModel.getTotalSalesReport({
            startDate,
            endDate,
        });

        return data;
    }
}
