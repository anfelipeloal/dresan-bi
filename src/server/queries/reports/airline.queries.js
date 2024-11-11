/* Client Performance */
export const getAirSalesByMothAndYear = `
    SELECT
        v.name airline,
        EXTRACT(YEAR from i.issue_date) AS "year",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 1 THEN b.total_fare ELSE 0 END), 0) AS "JANUARY",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 2 THEN b.total_fare ELSE 0 END), 0) AS "FEBRUARY",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 3 THEN b.total_fare ELSE 0 END), 0) AS "MARCH",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 4 THEN b.total_fare ELSE 0 END), 0) AS "APRIL",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 5 THEN b.total_fare ELSE 0 END), 0) AS "MAY",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 6 THEN b.total_fare ELSE 0 END), 0) AS "JUNE",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 7 THEN b.total_fare ELSE 0 END), 0) AS "JULY",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 8 THEN b.total_fare ELSE 0 END), 0) AS "AUGUST",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 9 THEN b.total_fare ELSE 0 END), 0) AS "SEPTEMBER",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 10 THEN b.total_fare ELSE 0 END), 0) AS "OCTOBER",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 11 THEN b.total_fare ELSE 0 END), 0) AS "NOVEMBER",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 12 THEN b.total_fare ELSE 0 END), 0) AS "DECEMBER"
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type stt ON stt.id = sst.service_type_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
        INNER JOIN submit_to st ON st.id = b.submit_to_id
        INNER JOIN profiles c on c.id = i.client_id
        INNER JOIN profiles v on v.id = b.vendor_id
        INNER JOIN business_units bu on bu.id = c.business_unit
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND st.name IN('ARC', 'Supplier', 'CommTrack')
        AND stt.name IN('Air')
        AND b.e_ticket_ind = '1'
        --conditions
    GROUP BY v.name, EXTRACT(YEAR FROM i.issue_date)
`;

export const getAirCommissionByMothAndYear = `
    SELECT
        v.name airline,
        EXTRACT(YEAR from i.issue_date) AS "year",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 1 THEN b.commission_rate ELSE 0 END), 0) AS "JANUARY",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 2 THEN b.commission_rate ELSE 0 END), 0) AS "FEBRUARY",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 3 THEN b.commission_rate ELSE 0 END), 0) AS "MARCH",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 4 THEN b.commission_rate ELSE 0 END), 0) AS "APRIL",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 5 THEN b.commission_rate ELSE 0 END), 0) AS "MAY",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 6 THEN b.commission_rate ELSE 0 END), 0) AS "JUNE",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 7 THEN b.commission_rate ELSE 0 END), 0) AS "JULY",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 8 THEN b.commission_rate ELSE 0 END), 0) AS "AUGUST",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 9 THEN b.commission_rate ELSE 0 END), 0) AS "SEPTEMBER",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 10 THEN b.commission_rate ELSE 0 END), 0) AS "OCTOBER",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 11 THEN b.commission_rate ELSE 0 END), 0) AS "NOVEMBER",
        COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM i.issue_date) = 12 THEN b.commission_rate ELSE 0 END), 0) AS "DECEMBER"
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type stt ON stt.id = sst.service_type_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
        INNER JOIN submit_to st ON st.id = b.submit_to_id
        INNER JOIN profiles c on c.id = i.client_id
        INNER JOIN profiles v on v.id = b.vendor_id
        INNER JOIN business_units bu on bu.id = c.business_unit
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND st.name IN('ARC', 'Supplier', 'CommTrack')
        AND stt.name IN('Air')
        AND b.e_ticket_ind = '1'
        --conditions
    GROUP BY v.name, EXTRACT(YEAR FROM i.issue_date)
`;

/* City Pairs Analysis */
export const getCityPairs = `
    WITH city_pairs_cte AS (
        SELECT
            cp.invoice_id,
            cp.booking_id,
            cp.index_no,
            cp.depart_city origin_city_code,
            cp.arrive_city destination_city_code
        FROM city_pairs cp
        WHERE cp.index_no = 1
    ),
    total_city_pairs AS (
        SELECT
            cpc.origin_city_code,
            cpc.destination_city_code,
            COUNT(b.id) as total_tickets
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN payment_status ips ON ips.id = i.payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN service_type st ON st.id = sst.service_type_id
            LEFT JOIN city_pairs_cte cpc ON cpc.invoice_id = i.id AND cpc.booking_id = b.id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment', 'Refund', 'Sale')
            AND ips.name IN('Open', 'Closed','N/A')
            AND cps.name IN('Open', 'Closed','N/A')
            AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
            AND st.name IN('Air')
            AND b.e_ticket_ind = '1'
        GROUP BY cpc.origin_city_code, cpc.destination_city_code
    ),
    filtered_bookings AS (
        SELECT
            cpc.origin_city_code dept,
            cpc.destination_city_code dest,
            SUM(b.total_fare) total_fare,
            SUM(b.commission_rate) total_commission,
            COUNT(b.id) client_tickets
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN payment_status ips ON ips.id = i.payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN service_type st ON st.id = sst.service_type_id
            INNER JOIN profiles c ON c.id = i.client_id
            INNER JOIN business_units bu on bu.id = c.business_unit
            LEFT JOIN city_pairs_cte cpc ON cpc.invoice_id = i.id AND cpc.booking_id = b.id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment', 'Refund', 'Sale')
            AND ips.name IN('Open', 'Closed','N/A')
            AND cps.name IN('Open', 'Closed','N/A')
            AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
            AND st.name IN('Air')
            AND b.e_ticket_ind = '1'
            --conditions
        GROUP BY cpc.origin_city_code, cpc.destination_city_code
    )
    SELECT
        fb.dept,
        fb.dest,
        fb.total_fare,
        fb.total_commission,
        fb.client_tickets as tickets,
        --tcp.total_tickets as total_tickets,
        ROUND(
            (fb.total_fare::numeric / fb.client_tickets::numeric), 2
        ) AS avg_ticket,
        ROUND(
            (fb.client_tickets::numeric(10,2) /
            NULLIF(tcp.total_tickets, 0)::numeric(10,2) * 100
            ), 2) as percentage_of
    FROM filtered_bookings fb
        JOIN total_city_pairs tcp ON tcp.origin_city_code = fb.dept 
            AND tcp.destination_city_code = fb.dest
    ORDER BY fb.total_fare DESC
    LIMIT 100;
`;

export const getCityPairClients = `
    WITH city_pairs_cte AS (
        SELECT
            cp.invoice_id,
            cp.booking_id,
            cp.index_no,
            cp.depart_city origin_city_code,
            cp.arrive_city destination_city_code
        FROM city_pairs cp
        WHERE cp.index_no = 1
    ),
    filtered_bookings AS (
        SELECT
            c.id profile_id,
            c.name profile_name,
            cpc.origin_city_code dept,
            cpc.destination_city_code dest,
            SUM(b.total_fare) total_fare,
            SUM(b.commission_rate) total_commission,
            COUNT(b.id) client_tickets
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN payment_status ips ON ips.id = i.payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN service_type st ON st.id = sst.service_type_id
            INNER JOIN profiles c ON c.id = i.client_id
            INNER JOIN business_units bu on bu.id = c.business_unit
            LEFT JOIN city_pairs_cte cpc ON cpc.invoice_id = i.id AND cpc.booking_id = b.id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment', 'Refund', 'Sale')
            AND ips.name IN('Open', 'Closed','N/A')
            AND cps.name IN('Open', 'Closed','N/A')
            AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
            AND st.name IN('Air')
            AND b.e_ticket_ind = '1'
            AND cpc.origin_city_code IN($3)
            AND cpc.destination_city_code IN($4)
        GROUP BY c.id, c.name, cpc.origin_city_code, cpc.destination_city_code
    ),
    total_tickets AS (
        SELECT SUM(total_fare) as total_fare_count
        FROM filtered_bookings
    )
    SELECT
        fb.profile_id,
        fb.profile_name,
        fb.dept,
        fb.dest,
        fb.total_fare,
        fb.total_commission,
        fb.client_tickets as tickets,
        TO_CHAR(
            (fb.total_fare * 100.0 / tt.total_fare_count),
            'FM999990.00'
        ) as percentage_of,
        'See details' as details
    FROM filtered_bookings fb
    CROSS JOIN total_tickets tt
    ORDER BY fb.total_fare DESC;
`;

export const getCityPairAirlines = `
    WITH city_pairs_cte AS (
        SELECT
            cp.invoice_id,
            cp.booking_id,
            cp.index_no,
            cp.depart_city origin_city_code,
            cp.arrive_city destination_city_code
        FROM city_pairs cp
        WHERE cp.index_no = 1
    ),
    filtered_bookings AS (
        SELECT
            v.id profile_id,
            v.name profile_name,
            cpc.origin_city_code dept,
            cpc.destination_city_code dest,
            SUM(b.total_fare) total_fare,
            SUM(b.commission_rate) total_commission,
            COUNT(b.id) client_tickets
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN payment_status ips ON ips.id = i.payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN service_type st ON st.id = sst.service_type_id
            INNER JOIN profiles c ON c.id = i.client_id
            INNER JOIN profiles v ON v.id = b.vendor_id
            INNER JOIN business_units bu on bu.id = c.business_unit
            LEFT JOIN city_pairs_cte cpc ON cpc.invoice_id = i.id AND cpc.booking_id = b.id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment', 'Refund', 'Sale')
            AND ips.name IN('Open', 'Closed','N/A')
            AND cps.name IN('Open', 'Closed','N/A')
            AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
            AND st.name IN('Air')
            AND b.e_ticket_ind = '1'
            AND cpc.origin_city_code IN($3)
            AND cpc.destination_city_code IN($4)
        GROUP BY  v.id, v.name, cpc.origin_city_code, cpc.destination_city_code
    ),
    total_tickets AS (
        SELECT SUM(total_fare) as total_fare_count
        FROM filtered_bookings
    )
    SELECT
        fb.profile_id,
        fb.profile_name,
        fb.dept,
        fb.dest,
        fb.total_fare,
        fb.total_commission,
        fb.client_tickets as tickets,
        TO_CHAR(
            (fb.total_fare * 100.0 / tt.total_fare_count),
            'FM999990.00'
        ) as percentage_of
    FROM filtered_bookings fb
    CROSS JOIN total_tickets tt
    ORDER BY fb.total_fare DESC; 
`;

export const getCityPairClientAirlines = `
   WITH city_pairs_cte AS (
        SELECT
            cp.invoice_id,
            cp.booking_id,
            cp.index_no,
            cp.depart_city origin_city_code,
            cp.arrive_city destination_city_code
        FROM city_pairs cp
        WHERE cp.index_no = 1
    ),
    filtered_bookings AS (
        SELECT
            c.id client_id,
            c.name client_name,
            v.name vendor_name,
            cpc.origin_city_code dept,
            cpc.destination_city_code dest,
            SUM(b.total_fare) total_fare,
            SUM(b.commission_rate) total_commission,
            COUNT(b.id) client_tickets
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN payment_status ips ON ips.id = i.payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN service_type st ON st.id = sst.service_type_id
            INNER JOIN profiles c ON c.id = i.client_id
            INNER JOIN profiles v ON v.id = b.vendor_id
            INNER JOIN business_units bu on bu.id = c.business_unit
            LEFT JOIN city_pairs_cte cpc ON cpc.invoice_id = i.id AND cpc.booking_id = b.id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment', 'Refund', 'Sale')
            AND ips.name IN('Open', 'Closed','N/A')
            AND cps.name IN('Open', 'Closed','N/A')
            AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
            AND st.name IN('Air')
            AND b.e_ticket_ind = '1'
            AND cpc.origin_city_code IN($3)
            AND cpc.destination_city_code IN($4)
            and c.id IN($5)
        GROUP BY c.id, c.name, v.name, cpc.origin_city_code, cpc.destination_city_code
    ),
    total_tickets AS (
        SELECT SUM(total_fare) as total_fare_count
        FROM filtered_bookings
    )
    SELECT
        fb.vendor_name Airline,
        fb.total_fare "Total Fare",
        fb.total_commission Commission,
        fb.client_tickets as Tickets,
        TO_CHAR(
            (fb.total_fare * 100.0 / tt.total_fare_count),
            'FM999990.00'
        ) as "% of"
    FROM filtered_bookings fb
    CROSS JOIN total_tickets tt
    ORDER BY fb.total_fare DESC;
`;
