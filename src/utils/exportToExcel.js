import { writeFile, utils } from 'xlsx';
import moment from 'moment';

function formatValue(value, format) {
    if (format.type === 'number') {
        const formattedValue = parseFloat(value).toFixed(format.decimals || 0);
        if (format.prefix !== '') {
            return format.prefix + formattedValue;
        }
        if (format.suffix !== '') {
            return formattedValue + format.suffix;
        }

        return parseFloat(formattedValue);
    }

    if (format.type === 'date') {
        return moment(value).format(format.format);
    }

    return value;
}

function formatColumns({ data, columnsDefinition }) {
    return data.map((row) => {
        const formattedRow = {};
        columnsDefinition.forEach((colDef) => {
            const { key } = colDef;
            const displayName = colDef.displayName || key;
            let value = row[key];
            if (colDef.format) {
                value = formatValue(value, colDef.format);
            }
            formattedRow[displayName] = value;
        });
        return formattedRow;
    });
}

export function exportToExcel({ data, columnsDefinition, fileName }) {
    return new Promise((resolve, reject) => {
        try {
            const formattedData = formatColumns({ data, columnsDefinition });
            const wb = utils.book_new();
            const ws = utils.json_to_sheet(formattedData);

            utils.book_append_sheet(wb, ws, 'Sheet1');

            writeFile(wb, `${fileName}.xlsx`);

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}
