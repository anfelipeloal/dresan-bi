export const byTravelTypeSummaryQuery = `
    SELECT
        sst.name service_sub_type,
        COUNT(b.invoice_id) bookings,
        COUNT(s.booking_id) segments,
        SUM(b.total_fare) total_fare,
        SUM(b.calc_base_fare) base,
        SUM(b.commission_rate) commission,
        SUM(b.remit_amount) markup
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        LEFT JOIN segments s ON s.booking_id = b.id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN payment_status ps ON ps.id = b.client_payment_status_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND ps.name <> 'Voided'
    GROUP BY service_sub_type
    ORDER BY service_sub_type

`;

export const byTotalSales = `
    SELECT
        '' AS Period,
        COUNT(b.id) bookings,
        SUM(b.total_fare) total_fare,
        SUM(b.calc_base_fare) base,
        SUM(b.commission_rate) commission,
        SUM(b.calc_fare_discount) markup
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN payment_status ps ON ps.id = b.client_payment_status_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment', 'Refund', 'Sale')
        AND ps.name IN('Open', 'Closed', 'N/A')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
`;

export const byMajorAirlinesGrouped = `
    SELECT
        v.name vendor_name,
        v.id vendor_id,
        DATE_PART('year', i.issue_date) AS year,
        DATE_PART('month', i.issue_date) AS month,
        COUNT(b.id) bookings,
        SUM(b.total_fare) total_fare,
        SUM(b.calc_base_fare) base,
        SUM(b.commission_rate) commission,
        SUM(b.calc_fare_discount) markup
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN profiles v ON v.id = b.vendor_id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type st on st.id = sst.service_type_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
        INNER JOIN payment_status ips ON ips.id = i.payment_status_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND v.name in ('American Airlines', 'United Airlines', 'Delta Air Lines', 'Air China International', 'Air Tanzania')
        AND st."name" IN ('Air')
        AND it.name IN('Adjustment', 'Refund', 'Sale')
        AND ips.name IN('Open','Closed','N/A')
        AND cps.name IN('Open','Closed','N/A')
        AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
    GROUP BY v."name", v.id, year, month
    ORDER BY year, month

`;
