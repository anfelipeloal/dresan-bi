export function trimText(span, text) {
    if (text.length <= span) {
        return text;
    }
    return `${text.slice(0, span - 3)}...`;
}

export function calculateMargin(totalCommission, totalFare) {
    const margin = (totalCommission / totalFare) * 100;

    if (!Number.isFinite(margin)) {
        return 'N/A';
    }

    return `${margin.toFixed(2)}%`;
}

export function calculateDifferencePercentage(value1, value2) {
    const num1 = parseFloat(value1) || 0;
    const num2 = parseFloat(value2) || 0;
    if (num1 === 0 && num2 === 0) return 0;
    if (num2 === 0) return num1 > 0 ? 100 : -100;
    const result = ((num1 - num2) / Math.abs(num2)) * 100;
    return parseFloat(result.toFixed(1));
}
