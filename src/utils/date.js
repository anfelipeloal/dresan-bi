export function formatDate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const localDate = `${year}-${month}-${day}`;
    return localDate;
}

export function getWorkingDays(startDate, endDate) {
    let counter = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        const dayOfWeek = currentDate.getDay();

        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            counter += 1;
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return counter;
}
