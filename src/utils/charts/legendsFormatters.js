import { numberFormat } from 'highcharts';

export function legendFormatterNumber({
    decimals = 2,
    dollarSign = true,
    name = true,
    value = true,
} = {}) {
    return function legendFormatter(legend) {
        return `
            <p style="font-size: 13.3px">
                ${name ? `<b>${legend.point.name ?? legend.point.category}</b>` : ''}${value ? ':' : ''}
                ${dollarSign ? '$' : ''}${value ? numberFormat(legend.y, decimals, '.', ',') : ''}
            </p>`;
    };
}

export function legendFormatterMillions({
    decimals = 1,
    dollarSign = true,
    value = true,
} = {}) {
    return function legendFormatter(legend) {
        let formattedValue = '';
        if (value) {
            const millions = legend.y / 1000000;
            formattedValue = `${numberFormat(millions, decimals, '.', ',')}M`;
        }

        return `
            <p style="font-size: 13.3px">
                ${dollarSign ? '$' : ''}${formattedValue}
            </p>`;
    };
}
