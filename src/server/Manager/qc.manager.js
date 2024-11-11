export default class QCManager {
    constructor() {
        this.validationRules = [
            {
                name: 'Int Air with total fare > 2,000 & margin <5%',
                condition: (invoice) => {
                    const intlAirBookings = invoice.filter((item) => item.service_sub_type === 'Intl Air' && item.e_ticket && parseFloat(item.total_fare) > 2000);
                    return intlAirBookings.some((item) => (item.commission / item.total_fare) * 100 < 5);
                },
            },
            {
                name: 'Dom air with total fare > 1,000 & margin <5%',
                condition: (invoice) => {
                    const intlAirBookings = invoice.filter((item) => item.service_sub_type === 'Dom. Air' && item.e_ticket && parseFloat(item.total_fare) > 1000);
                    return intlAirBookings.some((item) => (item.commission / item.total_fare) * 100 < 5);
                },
            },
            {
                name: 'INV without srv fee',
                condition: (invoice) => {
                    const exemptClientIds = ['28049'];
                    const hasServiceFee = invoice.some((item) => item.service_sub_type === 'Service Fee');
                    if (hasServiceFee) return false;
                    const isExemptClient = invoice.some((item) => exemptClientIds.includes(item.client_id));
                    return !isExemptClient;
                },
            },
        ];
    }

    groupBookingsByInvoice(bookings) {
        return bookings.reduce((acc, booking) => {
            if (!acc[booking.invoice_number]) {
                acc[booking.invoice_number] = [];
            }
            acc[booking.invoice_number].push(booking);
            return acc;
        }, {});
    }

    applyValidationRules(invoice) {
        return this.validationRules
            .filter((rule) => rule.condition(invoice))
            .map((rule) => rule.name);
    }

    validateBookings(bookings) {
        const invoices = this.groupBookingsByInvoice(bookings);

        const result = Object.values(invoices).flatMap((invoice) => {
            const qc = this.applyValidationRules(invoice);
            return invoice.map((booking) => ({ ...booking, qc }));
        });

        return result;
    }

    addValidationRule(name, condition) {
        this.validationRules.push({ name, condition });
    }
}
