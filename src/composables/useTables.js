import moment from 'moment';
import { useRouter } from 'vue-router';
import { DATA_TYPES, DRILLDOWN_REPORTS } from '~/config/constants';
import { useUtils } from './useUtils';
import { numberFormatWithoutSymbol, numberFormat } from '#imports';

export const useTables = (DataTablesCore, columnsDefinition, tableRef) => {
    const router = useRouter();
    const { formatDBColumn } = useUtils();
    const drillDownData = ref(null);
    const drillDownProgressBar = ref(0);
    const drillDownLoading = ref(false);
    const tableColumns = ref([]);
    const allData = ref([]);
    const precessedData = ref([]);
    const drillDownCategory = ref(null);
    const tableOptions = {
        info: false,
        paging: true,
        pageLength: -1,
        lengthChange: true,
        lengthMenu: [
            [10, 25, 50, 100, 250, -1],
            [10, 25, 50, 100, 250, 'All'],
        ],
        headerFilter: true,
        scrollX: true,
        dom: 'lBfrtip',
        language: {
            search: '',
            searchPlaceholder: 'Search',
        },
        buttons: [{
            text: 'Export',
            extend: 'excel',
            // split: ['copy', 'csv', 'excel', 'pdf', 'print'],
            split: ['excel'],
            className: 'focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 shadow-sm text-white dark:text-gray-900 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500 dark:disabled:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400 inline-flex items-center',
        }, {
            extend: 'colvis',
            text: 'Columns',
        }],
        ordering: true,
        order: [
            [2, 'desc'],
        ],
        // eslint-disable-next-line object-shorthand, func-names
        initComplete: async () => {
            getColumnsTotal();
        },
    };

    const invoiceColors = ref({});
    const colorIndex = ref(0);
    const colors = [
        '#e8edfc', 'transparent',
    ];

    function createTable({
        dataQuery = null,
        tableConfigOptions = null,
        dataSet = null,
        serverSideRendering = false,
        bookingTable = false,
    } = {}) {
        if (tableConfigOptions) {
            Object.keys(tableConfigOptions).forEach((property) => {
                tableOptions[property] = tableConfigOptions[property];
            });
        }

        if (bookingTable) {
            tableOptions.rowCallback = (row, data) => {
                const invoiceNumber = data.invoice_number;
                if (!invoiceColors.value[invoiceNumber]) {
                    invoiceColors.value[invoiceNumber] = colors[colorIndex.value % colors.length];
                    colorIndex.value += 1;
                }
                row.style.backgroundColor = invoiceColors.value[invoiceNumber];
            };
        }

        if (dataSet) {
            allData.value = dataSet;
        }
        if (serverSideRendering) {
            tableOptions.serverSide = true;
            tableOptions.processing = true;
            tableOptions.ajax = processAjaxData;
        }
        tableColumns.value = createTableColumns({ dataQuery });
    }

    function createTableColumns({ dataQuery = null } = {}) {
        const columns = [];
        columnsDefinition.forEach((column) => {
            if (column.key === 'actions') {
                columns.push({
                    data: null,
                    title: column.displayName ?? formatDBColumn(column.key),
                    render: column.render,
                    orderable: column.orderable,
                    searchable: column.searchable,
                    createdCell: async (td, cellData, rowData) => {
                        if (column.buttonActions) {
                            await nextTick();

                            column.buttonActions.forEach((button) => {
                                if (button.isDrillDown) {
                                    let dataReport = null;

                                    switch (button.drillDownReport) {
                                    case DRILLDOWN_REPORTS.city_pairs:
                                        dataReport = {
                                            startDate: rowData.query_conditions.startDate,
                                            endDate: rowData.query_conditions.endDate,
                                            originCity: rowData.dept,
                                            destinationCity: rowData.dest,
                                        };
                                        break;

                                    case DRILLDOWN_REPORTS.city_pairs_client_airlines:
                                        dataReport = {
                                            startDate: rowData.query_conditions.startDate,
                                            endDate: rowData.query_conditions.endDate,
                                            originCity: rowData.dept,
                                            destinationCity: rowData.dest,
                                            clientId: rowData.profile_id,
                                        };
                                        break;

                                    default:
                                        break;
                                    }

                                    tableRef.value.dt.$(td).find('.view-btn').on('click', () => {
                                        drillDownData.value = null;
                                        drillDownProgressBar.value = 0;
                                        drillDownLoading.value = true;
                                        drillDown(button.callBack, dataReport);
                                    });
                                }
                            });
                        }
                    },
                });
            } else {
                columns.push({
                    data: column.key,
                    title: column.displayName ?? formatDBColumn(column.key),
                    render: (data) => getColumnRender(column, data),
                    searchable: column.searchable ?? true,
                    createdCell: async (td, cellData, rowData) => { // (td, cellData, rowData, row, col)
                        if (isNumericColumn(column)) {
                            await nextTick();
                            if (cellData < 0) {
                                tableRef.value.dt.$(td).addClass('text-red-500');
                            }
                        }
                        if (column.isDrillDown) {
                            await nextTick();

                            let dataReport = null;

                            switch (column.drillDownReport) {
                            case DRILLDOWN_REPORTS.airline_production:
                                dataReport = {
                                    ...dataQuery,
                                    profileId: rowData.vendor_id,
                                };
                                break;

                            case DRILLDOWN_REPORTS.current_sales_report:
                                dataReport = {
                                    ...dataQuery,
                                    serviceSubTypeId: rowData.service_id,
                                };
                                break;

                            case DRILLDOWN_REPORTS.business_earnings_and_cost:
                                dataReport = {
                                    ...dataQuery,
                                    serviceSubTypeId: rowData.service_sub_type_id,
                                };
                                break;

                            case DRILLDOWN_REPORTS.booking_data_inquiry:
                                dataReport = {
                                    invoiceId: rowData.inv_id,
                                };
                                break;
                            case DRILLDOWN_REPORTS.bookings:
                                dataReport = {
                                    bookingId: rowData.booking_id,
                                };
                                break;

                            default:
                                break;
                            }

                            if (!('isDrilldown' in rowData)) {
                                if (column.drillDownReport === DRILLDOWN_REPORTS.current_sales_report && (rowData.bookings_dtd === 0)) {
                                    tableRef.value.dt.$(td).on('click', () => {});
                                    tableRef.value.dt.$(td).addClass('');
                                } else {
                                    tableRef.value.dt.$(td).on('click', () => {
                                        drillDownData.value = null;
                                        drillDownProgressBar.value = 0;
                                        drillDownLoading.value = true;
                                        drillDown(column.drillDownFn, dataReport);
                                    });
                                    tableRef.value.dt.$(td).addClass('hover:bg-blue-100 cursor-pointer');
                                }
                            }
                        }
                        if (column.isAgentPortal) {
                            await nextTick();
                            tableRef.value.dt.$(td).on('click', () => {
                                router.push(`/reports/agents/agent-portal/${rowData.user_id}`);
                            });
                            tableRef.value.dt.$(td).addClass('hover:bg-blue-100 cursor-pointer');
                        }
                        if (column.tierCompleted) {
                            await nextTick();
                            if (cellData >= 100) {
                                tableRef.value.dt.$(td).addClass('text-green-600');
                            }
                        }
                        if (column.copyToClipboard) {
                            await nextTick();
                            tableRef.value.dt.$(td).find('button').on('click', () => {
                                navigator.clipboard.writeText(cellData);
                            });
                        }
                        if (rowData.isDrilldown !== undefined) {
                            await nextTick();
                            tableRef.value.dt.$(td).on('click', () => {
                                drillDownCategory.value = null;
                                drillDownCategory.value = rowData.category;
                            });
                            tableRef.value.dt.$(td).addClass('cursor-pointer hover:bg-gray-200');
                        }
                        if (column.trafficLight) {
                            await nextTick();
                            if (cellData < 0) {
                                tableRef.value.dt.$(td).addClass('text-red-500');
                            } else if (cellData > 0) {
                                tableRef.value.dt.$(td).addClass('text-green-500');
                            } else if (cellData === 0) {
                                tableRef.value.dt.$(td).addClass('text-amber-500');
                            } else {
                                tableRef.value.dt.$(td).addClass('text-black');
                            }
                        }
                        /* tableRef.value.dt.$(td).addClass('text-center'); */
                    },
                });
            }
        });
        return columns;
    }

    // Others datatable renderers can be found here: https://datatables.net/manual/data/renderers#Built-in-helpers
    function getColumnRender(column, data) {
        let result = data;

        if ((isNumericColumn(column))) {
            // thousands, decimal, precision, prefix, suffix
            if (column.format.prefixPosition === 'right') {
                return DataTablesCore.render.number(',', '.', column.format.decimals, column.format.suffix, column.format.prefix).display(data);
            }
            result = DataTablesCore.render.number(',', '.', column.format.decimals, column.format.prefix, column.format.suffix).display(data);
        }

        if ((isDateColumn(column))) {
            const date = new Date(data);
            if (column.sumOne) {
                date.setDate(date.getDate() + 1);
            }
            const newFormatDate = moment(date).format(column?.format?.format ?? 'MM/DD/YY');
            result = newFormatDate;
        }

        if (column.trim) {
            if (result) {
                if (result.length > column.trimLength) {
                    result = `<span class="cursor-pointer" title="${result}">${result.slice(0, column.trimLength).trimEnd()}...</span>`;
                }
            }
        }

        if (column.flags) {
            if (result) {
                if (result.length > 0) {
                    result = `<span class="cursor-pointer" title="${result}">🚩${result.length}</span>`;
                }
            }
        }

        if (column.displayInThousands) {
            if (result) {
                result = `<span class="cursor-pointer" title="${numberFormat(result)}">${numberFormatWithoutSymbol((result / 1000).toFixed(0))}</span>`;
            }
        }

        if (column.copyToClipboard) {
            const button = `<button class=" text-black text-xs p-1 rounded hover:bg-gray-100 active:bg-gray-200" title="Copiar" style="margin-left: 10px">
                                <span class="i-mdi-content-copy text-gray-400"></span>
                            </button>`;
            result = `${result} ${button}`;
        }

        return result;
    }

    function isNumericColumn(column) {
        return column?.format?.type === DATA_TYPES.NUMBER.type;
    }

    function isDateColumn(column) {
        return column?.format?.type === DATA_TYPES.DATES.type;
    }

    async function getColumnsTotal() {
        await nextTick();
        columnsDefinition.forEach((column, index) => {
            if (isNumericColumn(column) && column.percentageAVG) {
                const col = tableRef.value.dt.column(index, { page: 'current' });
                const baseCol = tableRef.value.dt.column(columnsDefinition.findIndex((obj) => obj.key === column.pBase), { page: 'current' });
                const hundredCol = tableRef.value.dt.column(columnsDefinition.findIndex((obj) => obj.key === column.pHundred), { page: 'current' });

                const baseSum = baseCol.data().reduce((acum, val) => acum + (parseFloat(val) || 0), 0);
                const hundredSum = hundredCol.data().reduce((acum, val) => acum + (parseFloat(val) || 0), 0);

                let totalPercentage = '0';
                if (hundredSum !== 0 && baseSum !== 0) {
                    totalPercentage = ((baseSum / hundredSum) * 100).toFixed(1);
                }

                totalPercentage = Math.max(0, Math.min(100, parseFloat(totalPercentage)));

                col.footer().innerHTML = `<span ${totalPercentage > 100 ? 'class="text-green-500"' : ''}>${totalPercentage}%</span>`;
            }

            if (column.totalize) {
                if (column.key.includes('percentage')) {
                    // eslint-disable-next-line no-param-reassign
                    column.format.decimals = 0;
                }
                const col = tableRef.value.dt.column(index, { page: 'current' });
                const sum = col.data().reduce((acum, val) => acum + (parseFloat(val) || 0), 0);
                col.footer().innerHTML = `<span ${sum < 0 ? 'class="text-red-500"' : ''}>${getColumnRender(column, sum)}</span>`;
            }

            if (column.especialTotalize) {
                const col = tableRef.value.dt.column(index, { page: 'current' });
                const sum = col.data().reduce((acum, val) => {
                    if (val == null) return acum;

                    let numberValue;

                    if (typeof val === 'string') {
                        if (val.includes('<span')) {
                            const numberPart = val.split('<span')[0].trim();
                            const cleanNumber = numberPart.replace(/[^\d.-]/g, '');
                            numberValue = parseFloat(cleanNumber);
                        } else {
                            const cleanNumber = val.replace(/[^\d.-]/g, '');
                            numberValue = parseFloat(cleanNumber);
                        }
                    } else {
                        numberValue = parseFloat(val);
                    }

                    return acum + (Number.isNaN(numberValue) ? 0 : numberValue);
                }, 0);
                col.footer().innerHTML = `<span ${sum < 0 ? 'class="text-red-500"' : ''}>${getColumnRender(column, numberFormatWithoutSymbol(sum))}</span>`;
            }
        });
    }

    async function drillDown(drillDownFn, data) {
        const interval = setInterval(() => {
            if (drillDownProgressBar.value < 100) {
                drillDownProgressBar.value += 1;
            }
        }, 500);

        const dataSetDetail = await drillDownFn(data);
        drillDownData.value = dataSetDetail;
        drillDownLoading.value = false;
        clearInterval(interval);
        drillDownProgressBar.value = 100;
        setTimeout(() => {
            drillDownProgressBar.value = 101;
        }, 80);
    }

    function processAjaxData(data, callback) {
        const {
            start, length, search, order,
        } = data;

        // Filtrar datos
        let filteredData = allData.value;

        if (search.value) {
            filteredData = filteredData.filter((item) => Object.values(item).some((value) => value?.toString().toLowerCase().includes(search.value.toLowerCase())));
        }

        // Ordenar datos
        if (order.length > 0) {
            const orderColumnIndex = order[0].column;
            const orderDir = order[0].dir;
            const orderColumnName = data.columns[orderColumnIndex].data;

            filteredData = filteredData.sort((a, b) => {
                const aValue = a[orderColumnName];
                const bValue = b[orderColumnName];

                if (!Number.isNaN(parseFloat(aValue)) && !Number.isNaN(parseFloat(bValue))) {
                    const aNum = parseFloat(aValue) || 0;
                    const bNum = parseFloat(bValue) || 0;
                    return orderDir === 'asc' ? aNum - bNum : bNum - aNum;
                }

                if (aValue < bValue) {
                    return orderDir === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return orderDir === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        const paginatedData = filteredData.slice(start, start + length);

        precessedData.value = paginatedData;

        setTimeout(() => {
            callback({
                draw: data.draw,
                recordsTotal: allData.value.length,
                recordsFiltered: filteredData.length,
                data: paginatedData,
            });
        }, 150);
    }

    return {
        createTable,
        tableColumns,
        tableOptions,
        drillDownData,
        drillDownProgressBar,
        drillDownLoading,
        drillDownCategory,
    };
};
