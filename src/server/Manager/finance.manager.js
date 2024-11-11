import { VENDORS } from '../config/constants';

export default class FinanceManager {
    combinateReports({
        previusDayReportParam, monthReportParam, yearReportParam, monthBudget, yearBudget,
    }) {
        let previusDayReport = previusDayReportParam;
        let monthReport = monthReportParam;
        let yearReport = yearReportParam;

        if (yearReport.length >= 1) {
            const serviceTypesYtd = [];

            yearReport.forEach((item) => {
                serviceTypesYtd.push(item.service_sub_type);
            });

            yearReport = yearReport.map((value) => ({
                service_id: value.service_id,
                service_sub_type: value.service_sub_type,
                total_fare_ytd: parseFloat(value.total_fare),
                total_commission_ytd: parseFloat(value.total_commission),
                bookings_ytd: parseFloat(value.bookings),
            }));

            const clearArrayYtd = VENDORS.PRIMARY_VENDOR_SUB_TYPES.filter((key) => serviceTypesYtd.indexOf(key) === -1);
            if (clearArrayYtd.length > 0) {
                const missingYearReport = clearArrayYtd.map((value) => ({
                    service_sub_type: value,
                    total_fare_ytd: 0,
                    total_commission_ytd: 0,
                    bookings_ytd: 0,
                }));

                yearReport = [...yearReport, ...missingYearReport];
            }
        } else {
            yearReport = VENDORS.PRIMARY_VENDOR_SUB_TYPES.map((value) => ({
                service_sub_type: value,
                total_fare_ytd: 0,
                total_commission_ytd: 0,
                bookings_ytd: 0,
            }));
        }

        if (monthReport.length >= 1) {
            const serviceTypesmtd = [];

            monthReport.forEach((item) => {
                serviceTypesmtd.push(item.service_sub_type);
            });

            monthReport = monthReport.map((value) => ({
                service_id: value.service_id,
                service_sub_type: value.service_sub_type,
                total_fare_mtd: parseFloat(value.total_fare),
                total_commission_mtd: parseFloat(value.total_commission),
                bookings_mtd: parseFloat(value.bookings),
            }));

            const clearArraymtd = VENDORS.PRIMARY_VENDOR_SUB_TYPES.filter((key) => serviceTypesmtd.indexOf(key) === -1);
            if (clearArraymtd.length > 0) {
                const missingMonthReport = clearArraymtd.map((value) => ({
                    service_sub_type: value,
                    total_fare_mtd: 0,
                    total_commission_mtd: 0,
                    bookings_mtd: 0,
                }));

                monthReport = [...monthReport, ...missingMonthReport];
            }
        } else {
            monthReport = VENDORS.PRIMARY_VENDOR_SUB_TYPES.map((value) => ({
                service_sub_type: value,
                total_fare_mtd: 0,
                total_commission_mtd: 0,
                bookings_mtd: 0,
            }));
        }

        if (previusDayReport.length >= 1) {
            const serviceTypesdtd = [];

            previusDayReport.forEach((item) => {
                serviceTypesdtd.push(item.service_sub_type);
            });

            previusDayReport = previusDayReport.map((value) => ({
                service_id: value.service_id,
                service_sub_type: value.service_sub_type,
                total_fare_dtd: parseFloat(value.total_fare),
                total_commission_dtd: parseFloat(value.total_commission),
                bookings_dtd: parseFloat(value.bookings),
            }));

            const clearArraydtd = VENDORS.PRIMARY_VENDOR_SUB_TYPES.filter((key) => serviceTypesdtd.indexOf(key) === -1);

            if (clearArraydtd.length > 0) {
                const missingData = clearArraydtd.map((value) => ({
                    service_sub_type: value,
                    total_fare_dtd: 0,
                    total_commission_dtd: 0,
                    bookings_dtd: 0,
                }));
                previusDayReport = [...previusDayReport, ...missingData];
            }
        } else {
            previusDayReport = VENDORS.PRIMARY_VENDOR_SUB_TYPES.map((value) => ({
                service_sub_type: value,
                total_fare_dtd: 0,
                total_commission_dtd: 0,
                bookings_dtd: 0,
            }));
        }

        const dataReport = [];

        VENDORS.PRIMARY_VENDOR_SUB_TYPES.forEach((value) => {
            const yearProfile = yearReport.find((year) => year.service_sub_type === value);
            const monthProfile = monthReport.find((month) => month.service_sub_type === value);
            const dayProfile = previusDayReport.find((day) => day.service_sub_type === value);

            const monthBudgetEntry = monthBudget.find((entry) => entry.service_sub_type_id === parseInt(monthProfile.service_id, 10));
            const yearBudgetEntry = yearBudget.find((entry) => entry.service_sub_type_id === parseInt(yearProfile.service_id, 10));

            dataReport.push({
                service_id: yearProfile.service_id || monthProfile.service_id || dayProfile.service_id,
                ...yearProfile,
                ...monthProfile,
                ...dayProfile,
                total_sales_percentage: 0,
                bookings_percentage: 0,
                sales_budget_mtd: monthBudgetEntry ? parseFloat(monthBudgetEntry.sales_budget) || 0 : 0,
                sales_budget_ytd: yearBudgetEntry ? parseFloat(yearBudgetEntry.sales_budget) || 0 : 0,
                commission_budget_mtd: monthBudgetEntry ? parseFloat(monthBudgetEntry.cost_of_sales_budget) || 0 : 0,
                commission_budget_ytd: yearBudgetEntry ? parseFloat(yearBudgetEntry.cost_of_sales_budget) || 0 : 0,
            });
        });

        dataReport.sort((a, b) => {
            const order = {
                'Intl Air': 0,
                'Dom. Air': 1,
                Hotel: 2,
                'Service Fee': 3,
                Car: 4,
                limo: 6,
                'Ship-Finl': 7,
                'Tour-Finl': 8,
                rail: 9,
                Insurance: 10,
                'Misc.': 11,
                'CC Merch Fee Serv': 12,
                'Charge Back Fee': 13,
                Seats: 14,
            };

            return order[a.service_sub_type] - order[b.service_sub_type];
        });

        const sumTotalFareDtd = dataReport.reduce((total, registro) => total + registro.total_fare_dtd, 0);
        const sumTotalCommissionDtd = dataReport.reduce((total, registro) => total + registro.total_commission_dtd, 0);

        dataReport.forEach((registro) => {
            const porcentajeTotalFare = (registro.total_fare_dtd / sumTotalFareDtd) * 100;
            const porcentajeTotalCommission = (registro.total_commission_dtd / sumTotalCommissionDtd) * 100;
            // eslint-disable-next-line no-param-reassign, no-restricted-globals
            registro.total_sales_dtd_percentage = isNaN(porcentajeTotalFare) ? 0 : porcentajeTotalFare.toFixed(2);
            // eslint-disable-next-line no-param-reassign, no-restricted-globals
            registro.total_commission_dtd_percentage = isNaN(porcentajeTotalCommission) ? 0 : porcentajeTotalCommission.toFixed(2);
        });

        dataReport.forEach((registro) => {
            const porcentajeTotalFare = registro.sales_budget_mtd ? ((registro.total_fare_mtd - registro.sales_budget_mtd) / registro.sales_budget_mtd) * 100 : 0;
            const porcentajeTotalCommission = registro.commission_budget_mtd ? ((registro.total_commission_mtd - registro.commission_budget_mtd) / registro.commission_budget_mtd) * 100 : 0;
            // eslint-disable-next-line no-param-reassign, no-restricted-globals
            registro.total_sales_mtd_percentage = isNaN(porcentajeTotalFare) ? 0 : porcentajeTotalFare.toFixed(2);
            // eslint-disable-next-line no-param-reassign, no-restricted-globals
            registro.total_commission_mtd_percentage = isNaN(porcentajeTotalCommission) ? 0 : porcentajeTotalCommission.toFixed(2);
        });

        dataReport.forEach((registro) => {
            const porcentajeTotalFare = registro.sales_budget_ytd ? ((registro.total_fare_ytd - registro.sales_budget_ytd) / registro.sales_budget_ytd) * 100 : 0;
            const porcentajeTotalCommission = registro.commission_budget_ytd ? ((registro.total_commission_ytd - registro.commission_budget_ytd) / registro.commission_budget_ytd) * 100 : 0;
            // eslint-disable-next-line no-param-reassign, no-restricted-globals
            registro.total_sales_ytd_percentage = isNaN(porcentajeTotalFare) ? 0 : porcentajeTotalFare.toFixed(2);
            // eslint-disable-next-line no-param-reassign, no-restricted-globals
            registro.total_commission_ytd_percentage = isNaN(porcentajeTotalCommission) ? 0 : porcentajeTotalCommission.toFixed(2);
        });

        return dataReport;
    }

    combinateBudgetReports({ budgetSales, budgetCostOfSales }) {
        const salesDict = Object.fromEntries(budgetSales.map((item) => [item.service_sub_type_id, item]));
        const costDict = Object.fromEntries(budgetCostOfSales.map((item) => [item.service_sub_type_id, item]));

        const allIds = new Set([...Object.keys(salesDict), ...Object.keys(costDict)]);

        const combinedReport = Array.from(allIds).map((serviceId) => {
            const salesItem = salesDict[serviceId] || {};
            const costItem = costDict[serviceId] || {};

            const salesBudget = parseFloat(salesItem.credit_amount || 0);

            const salesCredit = parseFloat(salesItem.credit_amount || 0);
            const costDebit = parseFloat(costItem.debit_amount || 0);
            const costOfSalesBudget = salesCredit - costDebit;

            return {
                service_sub_type_id: parseInt(serviceId, 10),
                sales_budget: salesBudget,
                cost_of_sales_budget: costOfSalesBudget,
            };
        });

        return combinedReport;
    }

    getTopByCategoryAndCreatingOthers({ dataParam }) {
        const data = dataParam;
        const filter = 'corporate';
        const topNumber = 5;
        const categoryBy = 'service_sub_type';
        const columnsToSum = ['corporate', 'consolidator', 'ic_unit', 'leisure'];

        const categorizedData = data.map((item) => ({
            ...item,
            category: item[categoryBy].split(' - ')[0],
        }));

        const hotelData = categorizedData.filter((item) => item.category === 'Hotel');
        const airData = categorizedData.filter((item) => ['Intl Air', 'Dom. Air'].includes(item.category));
        const otherServicesData = categorizedData.filter((item) => !['Hotel', 'Intl Air', 'Dom. Air'].includes(item.category));

        const top = [];
        const others = {};

        const airCategories = ['Intl Air', 'Dom. Air'];
        airCategories.forEach((category) => {
            const categoryData = airData.filter((item) => item.category === category).sort((a, b) => b[filter] - a[filter]);
            const topByGroup = categoryData.slice(0, topNumber);
            const otherByGroup = categoryData.slice(topNumber);

            top.push(...topByGroup);

            if (otherByGroup.length > 0) {
                const othersTemplate = this.createOthersTemplate(topByGroup[0], otherByGroup, columnsToSum, `Others ${category}`);
                top.push(othersTemplate);
                others[category] = otherByGroup;
            }
        });

        top.push(...hotelData);

        if (otherServicesData.length > 0) {
            const othersTemplate = this.createOthersTemplate(otherServicesData[0], otherServicesData, columnsToSum, 'Others');
            othersTemplate.category = 'Others';
            top.push(othersTemplate);
            others.Others = otherServicesData;
        }

        return { top, others };
    }

    createOthersTemplate(baseItem, groupItems, columnsToSum, label) {
        const othersTemplate = { ...baseItem };
        const firstKey = Object.keys(othersTemplate)[0];

        Object.keys(othersTemplate).forEach((key) => {
            if (!columnsToSum.includes(key) && key !== 'category') {
                othersTemplate[key] = null;
            }
            if (columnsToSum.includes(key)) {
                othersTemplate[key] = groupItems.reduce((sum, item) => sum + parseFloat(item[key]), 0);
            }
        });

        othersTemplate[firstKey] = label;
        othersTemplate.isDrilldown = true;

        return othersTemplate;
    }

    generateClientPerformanceReport({ data }) {
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;
        const currentMonth = new Date().getMonth() + 1; // 0-indexed
        const today = new Date().getDate();

        const currentYearData = data.filter((item) => item.year === currentYear);
        const lastYearData = data.filter((item) => item.year === lastYear);

        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

        function getDaysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
        }

        function calculateMonthProjection(monthValue, currentDay, totalDaysInMonth) {
            const dailyAverage = monthValue / currentDay;
            return dailyAverage * totalDaysInMonth;
        }

        function calculateYTD(yearData) {
            return months.slice(0, currentMonth).reduce((sum, month) => sum + parseFloat(yearData[month] || 0), 0);
        }

        function calculateAverage(total, count) {
            return count > 0 ? total / count : 0;
        }

        const report = [];
        const clients = [...new Set(currentYearData.map((item) => item.client))];

        const daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear);
        const currentMonthName = months[currentMonth - 1];

        clients.forEach((client) => {
            const currentYearClientData = currentYearData.find((item) => item.client === client) || {};
            const lastYearClientData = lastYearData.find((item) => item.client === client) || {};

            const ytd = calculateYTD(currentYearClientData);
            const lastYtd = calculateYTD(lastYearClientData);
            const avgCurrentYear = calculateAverage(ytd, currentMonth);
            const avgLastYear = calculateAverage(lastYtd, currentMonth);

            const lastMonthName = months[currentMonth - 1];
            const lastLastMonthName = months[currentMonth - 2];

            const currentMonthValue = parseFloat(currentYearClientData[currentMonthName] || 0);
            const monthProjection = calculateMonthProjection(currentMonthValue, today, daysInCurrentMonth);

            const clientReport = {
                client,
                business_unit: currentYearClientData.business_unit || lastYearClientData.business_unit || '',
                ytd,
                lastYtd,
                avg_current_year: avgCurrentYear,
                avg_last_year: avgLastYear,
                last_month_fc: 0,
                lm_vs_fc: 0,
                last_month_vs_avg: (((parseFloat(currentYearClientData[lastMonthName]) - avgCurrentYear) / (avgCurrentYear || 1)) * 100) || 0,
                avg_last_year_vs_avg_current_year: avgLastYear !== 0 ? (((avgCurrentYear - avgLastYear) / avgLastYear) * 100) || 0 : 'New',
                last_two_month: 0,
                total_fare_last_month_ly_1: parseFloat(lastYearClientData[lastLastMonthName] || 0),
                total_fare_last_month_ly_2: parseFloat(lastYearClientData[lastMonthName] || 0),
                lm_current_year_vs_lm_last_year: parseFloat(lastYearClientData[lastMonthName]) !== 0 ? (((parseFloat(currentYearClientData[lastMonthName]) - parseFloat(lastYearClientData[lastMonthName])) / parseFloat(lastYearClientData[lastMonthName])) * 100) || 0 : 'New',
                annual_fc: 0,
                month_projection: monthProjection,
            };

            months.slice(0, currentMonth).forEach((month) => {
                clientReport[month] = parseFloat(currentYearClientData[month] || 0);
            });

            report.push(clientReport);
        });

        return report.filter((client) => client.ytd !== 0);
    }
}
