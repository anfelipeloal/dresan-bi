/* eslint-disable import/no-extraneous-dependencies */
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import jszip from 'jszip';

// eslint-disable-next-line sort-imports
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons/js/buttons.colVis.mjs';
import 'datatables.net-buttons/js/buttons.html5.mjs';

DataTable.use(DataTablesCore);
DataTablesCore.Buttons.jszip(jszip);

export {
    DataTable,
    DataTablesCore,
};
