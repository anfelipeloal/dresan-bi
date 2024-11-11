export default class GeneralManager {
    getInvoices({ bookings }) {
        const invoiceMap = new Map();

        bookings.forEach((item) => {
            const invoiceNumber = item.invoice_number;

            if (!invoiceMap.has(invoiceNumber)) {
                invoiceMap.set(invoiceNumber, {
                    inv_id: item.invoice_id,
                    issue_date: item.issue_date,
                    invoice_number: invoiceNumber,
                    pnr: item.pnr,
                    inv_type: item.inv_type.charAt(0),
                    branch: item.branch,
                    client_name: item.client_name,
                    agent: item.agent,
                    passenger: item.passenger_name,
                    business_unit: item.business_unit,
                    inv_total: 0,
                    booking_count: 0,
                });
            }

            const invoice = invoiceMap.get(invoiceNumber);

            invoice.booking_count += 1;

            if ((item.submit_to === 'ARC' || item.submit_to === 'Supplier')
                && (item.client_status !== 'Voided' || item.vendor_status !== 'Voided')) {
                invoice.inv_total += parseFloat(item.total_fare) || 0;
            }
        });

        const invoices = Array.from(invoiceMap.values());

        return invoices;
    }
}
