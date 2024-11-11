export function numberFormat(value, decimals = 2) {
    return !Number.isNaN(Number(value))
        ? Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value)
        : 0;
}

export function numberFormatWithoutSymbol(value) {
    return !Number.isNaN(Number(value))
        ? Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
        : '0.00';
}
