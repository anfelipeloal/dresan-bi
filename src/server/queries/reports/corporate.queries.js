/* By Service Type */
export const byTravelTypeTop = `
    WITH top_5_cte AS (
        SELECT
            st.name service_type,
            COUNT(b.id) bookings,
            SUM(b.total_fare) total_fare,
            SUM(b.calc_base_fare) base,
            SUM(b.commission_rate) commission,
            SUM(b.calc_fare_discount) markup
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN service_type st on st.id = sst.service_type_id
            INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
            INNER JOIN payment_status ips ON ips.id = i.payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment','Refund','Sale')
            AND ips.name IN('Open', 'Closed', 'N/A')
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND tt2."name" IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
            AND st.name IN ('Air','Hotel','Car','Service Fee')
        GROUP BY st.name
        LIMIT 4
    ),
    others_cte AS (
        SELECT
            'Others' service_type,
            COUNT(b.id) bookings,
            SUM(b.total_fare) total_fare,
            SUM(b.calc_base_fare) base,
            SUM(b.commission_rate) commission,
            SUM(b.calc_fare_discount) markup
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN service_type st on st.id = sst.service_type_id
            INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
            INNER JOIN payment_status ips ON ips.id = i.payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment','Refund','Sale')
            AND ips.name IN('Open', 'Closed', 'N/A')
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND tt2."name" IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
        AND st.name NOT IN (SELECT service_type FROM top_5_cte)
        GROUP BY service_type
    )
    SELECT *
    FROM (
        SELECT * FROM top_5_cte
        UNION ALL
        SELECT * FROM others_cte
    ) AS final_result;
`;

/* By Service Type Others */
export const byTravelTypeOther = `
    SELECT
        st.name service_type,
        COUNT(b.id) bookings,
        SUM(b.total_fare) total_fare,
        SUM(b.calc_base_fare) base,
        SUM(b.commission_rate) commission,
        SUM(b.calc_fare_discount) markup
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type st on st.id = sst.service_type_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
        INNER JOIN payment_status ips ON ips.id = i.payment_status_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND ips.name IN('Open', 'Closed', 'N/A')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND tt2."name" IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
        AND st.name NOT IN ('Air','Hotel','Car','Service Fee')
    GROUP BY st.name
    ORDER BY total_fare DESC
`;

/* By service sub type */
export const byTravelSubTypeTop = `
    WITH top_5_cte AS (
        SELECT
            sst.name service_sub_type,
            COUNT(b.id) bookings,
            SUM(b.total_fare) total_fare,
            SUM(b.calc_base_fare) base,
            SUM(b.commission_rate) commission,
            SUM(b.calc_fare_discount) markup
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
            INNER JOIN payment_status ips ON ips.id = i.payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment','Refund','Sale')
            AND ips.name IN('Open', 'Closed', 'N/A')
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND tt2."name" IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
            AND sst.name IN ('Dom. Air', 'Intl Air', 'Hotel', 'Car')
        GROUP BY sst.name
        ORDER BY total_fare DESC
        LIMIT 4
    ),
    others_cte AS (
        SELECT
            'Others' service_sub_type,
            COUNT(b.id) bookings,
            SUM(b.total_fare) total_fare,
            SUM(b.calc_base_fare) base,
            SUM(b.commission_rate) commission,
            SUM(b.calc_fare_discount) markup
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
            INNER JOIN payment_status ips ON ips.id = i.payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment','Refund','Sale')
            AND ips.name IN('Open', 'Closed', 'N/A')
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND tt2."name" IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
        AND sst.name NOT IN (SELECT service_sub_type FROM top_5_cte)
        GROUP BY service_sub_type
    )
    SELECT *
    FROM (
        SELECT * FROM top_5_cte
        UNION ALL
        SELECT * FROM others_cte
    ) AS final_result;
`;

/* By service sub Others */
export const byTravelSubTypeOther = `
    SELECT
        sst.name service_sub_type,
        COUNT(b.id) bookings,
        SUM(b.total_fare) total_fare,
        SUM(b.calc_base_fare) base,
        SUM(b.commission_rate) commission,
        SUM(b.calc_fare_discount) markup
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type st on st.id = sst.service_type_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
        INNER JOIN payment_status ips ON ips.id = i.payment_status_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND ips.name IN('Open', 'Closed', 'N/A')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND tt2."name" IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
        AND sst.name NOT IN ('Dom. Air', 'Intl Air', 'Hotel', 'Car')
    GROUP BY sst.name
    ORDER BY total_fare DESC
`;

/* Business Unit */
export const byBusinessUnit = `
    SELECT
        bu."name" business_unit,
        COUNT(b.id) bookings,
        SUM(b.total_fare) total_fare,
        SUM(b.calc_base_fare) base,
        SUM(b.commission_rate) commission,
        SUM(b.calc_fare_discount) markup
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN profiles c ON c.id = i.client_id
        INNER JOIN business_units bu on bu.id = c.business_unit
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN payment_status ips ON ips.id = b.client_payment_status_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment', 'Refund', 'Sale')
        AND ips.name IN('Open', 'Closed', 'N/A')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
    GROUP BY bu."name"
    ORDER BY bu."name"
`;

/* Business Unit Sales */
export const byBusinessUnitHistory = `
    SELECT
        bu."name" business_unit,
        COUNT(b.id) bookings,
        SUM(b.total_fare) total_fare,
        SUM(b.calc_base_fare) base,
        SUM(b.commission_rate) commission,
        SUM(b.calc_fare_discount) markup
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN profiles c ON c.id = i.client_id
        INNER JOIN business_units bu ON bu.id = c.business_unit
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN payment_status ips ON ips.id = b.client_payment_status_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment', 'Refund', 'Sale')
        AND ips.name IN('Open', 'Closed', 'N/A')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
    GROUP BY bu."name"
    ORDER BY bu."name"
`;

/* Airline Production */
export const byAirlinesProduction = `
    SELECT
        v.id vendor_id,
        v.name vendor_name,
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
        AND st."name" IN ('Air')
        AND it.name IN('Adjustment', 'Refund', 'Sale')
        AND ips.name IN('Open','Closed','N/A')
        AND cps.name IN('Open','Closed','N/A')
        AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
    GROUP BY v.id, v."name"
`;

/* Airline Production detail */
export const byAirlinesProductionDetail = `
    SELECT
        i.issue_date,
        i."number" invoice_number,
        v.id vendor_id,
        v.name vendor_name,
        b.passenger_name,
        b.total_fare,
        b.commission_rate commission,
        b.calc_fare_discount markup
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN profiles v ON v.id = b.vendor_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type st on st.id = sst.service_type_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND st."name" IN('Air')
        AND tt2."name" IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
        and v.id = $3
    ORDER BY i.issue_date ASC
`;

/* Airline Production History */
export const byMajorAirlineProduction = `
    SELECT
        v.name vendor_name,
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
        AND v.name in ('American Airlines', 'United Airlines', 'Delta Air Lines')
        AND st."name" IN ('Air')
        AND it.name IN('Adjustment', 'Refund', 'Sale')
        AND ips.name IN('Open','Closed','N/A')
        AND cps.name IN('Open','Closed','N/A')
        AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
    GROUP BY v."name"
    ORDER BY total_fare DESC
    LIMIT 15

`;

/* Top customers */
export const topCustomers = `
    SELECT
        c.name customer_name,
        COUNT(b.id) bookings,
        SUM(b.total_fare) total_fare,
        SUM(b.calc_base_fare) base,
        SUM(b.commission_rate) commission,
        SUM(b.calc_fare_discount) markup,
        bu."name" business_unit
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN profiles c ON c.id = i.client_id
        INNER JOIN business_units bu ON bu.id = c.business_unit
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
        INNER JOIN payment_status ips ON ips.id = i.payment_status_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment', 'Refund', 'Sale')
        AND ips.name IN('Open', 'Closed', 'N/A')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
    GROUP BY c."name", bu."name"
    ORDER BY total_fare DESC
    LIMIT 15
`;

/* Top corporate customers */
export const topCorporateCustomers = `
    SELECT
        c.name customer_name,
        COUNT(b.id) bookings,
        SUM(b.total_fare) total_fare,
        SUM(b.calc_base_fare) base,
        SUM(b.commission_rate) commission,
        SUM(b.calc_fare_discount) markup
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN profiles c ON c.id = i.client_id
        INNER JOIN business_units bu ON bu.id = c.business_unit
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
        INNER JOIN payment_status ips ON ips.id = i.payment_status_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment', 'Refund', 'Sale')
        AND ips.name IN('Open', 'Closed', 'N/A')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
        AND bu."name" = 'CORPORATE'
    GROUP BY c."name"
    ORDER BY total_fare DESC
    LIMIT 15

`;

/* taboola booking Report */
export const taboolaReport = `
    SELECT
        c.name company_name,
        b.passenger_name,
        bu_pivoted.employee_id,
        bu_pivoted.traveler_email,
        b.passenger_dept department_code,
        bu_pivoted.vp_name,
        bu_pivoted.vp_email,
        bu_pivoted.vp_job_title,
        bu_pivoted.u_location,
        bu_pivoted.trip_reason,
        b.id booking_nr,
        i."number" invoice_nr,
        i.record_locator rloc,
        sst."name" booking_type,
        b.depart_date start_date,
        b.return_date end_date,
        (
            SELECT cp.depart_city
            FROM city_pairs cp
            WHERE cp.invoice_id = i.id
                AND cp.booking_id = b.id
            ORDER BY cp.index_no
            LIMIT 1
        ) origin_ciyt_code,
        (
            SELECT cp.arrive_city
            FROM city_pairs cp
            WHERE cp.invoice_id = i.id
                AND cp.booking_id = b.id
            ORDER BY cp.index_no
            LIMIT 1
        ) destination_city_code,
        b.calc_num_of_days duration,
        b.total_fare,
        CASE WHEN b.currency_code = '' THEN 'USD' END orig_currency,
        v."name" vendor,
        i.issue_date
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN profiles c ON c.id = i.client_id
        INNER JOIN profiles v ON v.id= b.vendor_id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN payment_status ips ON ips.id = i.payment_status_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
        LEFT JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        LEFT JOIN (
            SELECT
                booking_id,
                MAX(CASE WHEN u."number" = 17 THEN bu.value ELSE NULL END) AS employee_id,
                MAX(CASE WHEN u."number" = 19 THEN bu.value ELSE NULL END) AS vp_email,
                MAX(CASE WHEN u."number" = 21 THEN bu.value ELSE NULL END) AS vp_job_title,
                MAX(CASE WHEN u."number" = 22 THEN bu.value ELSE NULL END) AS vp_name,
                MAX(CASE WHEN u."number" = 26 THEN bu.value ELSE NULL END) AS trip_reason,
                MAX(CASE WHEN u."number" = 42 THEN bu.value ELSE NULL END) AS u_location,
                MAX(CASE WHEN u."number" = 64 THEN bu.value ELSE NULL END) AS traveler_email
            FROM bookings_udids bu
                LEFT JOIN udids u ON u.id = bu.udid_id
            GROUP BY booking_id
        ) bu_pivoted ON bu_pivoted.booking_id = b.id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment', 'Refund', 'Sale')
        AND ips.name IN('Open', 'Closed','N/A')
            AND cps.name IN('Open', 'Closed','N/A')
        AND tt2.name IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
        AND i.client_id = 37596
    ORDER BY i.issue_date, i."number", booking_nr ASC
`;

/* Corporate Travel Summary */
export const getOBTAdoptionsOnline = `
    -- AIR
    SELECT
        'Air' service_type,
        COUNT(b.id) bookings
    FROM bookings b
        INNER JOIN invoices i ON i.id = b.invoice_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type st ON st.id = sst.service_type_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND st."name" IN('Air')
        AND b.online IS TRUE
        AND i.client_id = $3
    UNION ALL 
    -- HOTEL
    SELECT
        'Hotel' service_type,
        COUNT(b.id) bookings
    FROM bookings b
        INNER JOIN invoices i ON i.id = b.invoice_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type st ON st.id = sst.service_type_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND st."name" IN('Hotel')
        AND b.online IS TRUE
        AND i.client_id = $3
    UNION ALL
    -- CAR
    SELECT
        'Car' service_type,
        COUNT(b.id) bookings
    FROM bookings b
        INNER JOIN invoices i ON i.id = b.invoice_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type st ON st.id = sst.service_type_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND st."name" IN('Car')
        AND b.online IS TRUE
        AND i.client_id = $3
    UNION ALL
    -- DOM. AIR
    SELECT
        'Dom. Air' service_type,
        COUNT(b.id) bookings
    FROM bookings b
        INNER JOIN invoices i ON i.id = b.invoice_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND sst.name IN ('Dom. Air')
        AND b.online IS TRUE
        AND i.client_id = $3
    UNION ALL 
    -- INTL AIR
    SELECT
        'Intl Air' service_type,
        COUNT(b.id) bookings
    FROM bookings b
        INNER JOIN invoices i ON i.id = b.invoice_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND sst.name IN ('Intl Air')
        AND b.online IS TRUE
        AND i.client_id = $3
`;

export const getOBTAdoptionsTotals = `
    -- AIR
    SELECT
        'Air' service_type,
        COUNT(b.id) bookings
    FROM bookings b
        INNER JOIN invoices i ON i.id = b.invoice_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type st ON st.id = sst.service_type_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND st."name" IN('Air')
        AND i.client_id = $3
    UNION ALL 
    -- HOTEL
    SELECT
        'Hotel' service_type,
        COUNT(b.id) bookings
    FROM bookings b
        INNER JOIN invoices i ON i.id = b.invoice_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type st ON st.id = sst.service_type_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND st."name" IN('Hotel')
        AND i.client_id = $3
    UNION ALL
    -- CAR
    SELECT
        'Car' service_type,
        COUNT(b.id) bookings
    FROM bookings b
        INNER JOIN invoices i ON i.id = b.invoice_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type st ON st.id = sst.service_type_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND st."name" IN('Car')
        AND i.client_id = $3
    UNION ALL
    -- DOM. AIR
    SELECT
        'Dom. Air' service_type,
        COUNT(b.id) bookings
    FROM bookings b
        INNER JOIN invoices i ON i.id = b.invoice_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND sst.name IN ('Dom. Air')
        AND i.client_id = $3
    UNION ALL 
    -- INTL AIR
    SELECT
        'Intl Air' service_type,
        COUNT(b.id) bookings
    FROM bookings b
        INNER JOIN invoices i ON i.id = b.invoice_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND sst.name IN ('Intl Air')
        AND i.client_id = $3
`;
