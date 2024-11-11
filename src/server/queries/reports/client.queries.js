export const getClientProductivityHistory = ` 
    SELECT
        DATE_PART('year', i.issue_date) AS year,
        DATE_PART('month', i.issue_date) AS month,
        COUNT(DISTINCT i.id) AS invoices,
        COUNT(DISTINCT b.id) AS bookings,
        SUM(b.commission_rate) commission,
        SUM(b.total_fare) total_fare,
        SUM(CASE WHEN b.commission_rate <> 0 THEN b.total_fare ELSE 0 END) AS total_fare_with_commission,
        SUM(CASE WHEN b.commission_rate = 0 THEN b.total_fare ELSE 0 END) AS total_fare_without_commission
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
        INNER JOIN submit_to st ON st.id = b.submit_to_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND st.name IN ('ARC', 'Supplier', 'CommTrack')
        AND i.client_id = ANY($3)
    GROUP BY year, month
    ORDER BY year, month
`;

export const getClientTicketsValueHistory = `
    SELECT
        DATE_PART('year', i.issue_date) AS year,
        DATE_PART('month', i.issue_date) AS month,
        COUNT(DISTINCT i.id) AS invoices,
        COUNT(DISTINCT b.id) AS bookings,
        SUM(b.commission_rate) commission,
        SUM(b.total_fare) total_fare,
        SUM(b.total_fare) / COUNT(DISTINCT b.id) average_ticket,
        MIN(b.total_fare) AS min_fare,
        MAX(b.total_fare) AS max_fare
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type stt ON stt.id = sst.service_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
        INNER JOIN submit_to st ON st.id = b.submit_to_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND st.name IN ('ARC', 'Supplier', 'CommTrack')
        AND stt.name IN('Air')
        AND b.e_ticket_ind IN('1')
        AND i.client_id IN($3)
    GROUP BY year, month
    ORDER BY year, month
`;

export const getClientByTravelSubTypeTop = `
    WITH top_5_cte AS (
        SELECT
            sst.name service_sub_type,
            c."name" client_name,
            COUNT(DISTINCT i.id) AS invoices,
            COUNT(DISTINCT b.id) AS bookings,
            SUM(b.commission_rate) commission,
            SUM(b.total_fare) total_fare
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
            INNER JOIN submit_to st ON st.id = b.submit_to_id
            INNER JOIN profiles c on c.id = i.client_id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment','Refund','Sale')
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND st.name IN ('ARC', 'Supplier', 'CommTrack')
            AND i.client_id IN($3)
        GROUP BY c."name", sst.name
        ORDER BY total_fare DESC
        LIMIT 4
    ),
    others_cte AS (
        SELECT
            'Others' service_sub_type,
            c."name" client_name,
            COUNT(DISTINCT i.id) AS invoices,
            COUNT(DISTINCT b.id) AS bookings,
            SUM(b.commission_rate) commission,
            SUM(b.total_fare) total_fare
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
            INNER JOIN submit_to st ON st.id = b.submit_to_id
            INNER JOIN profiles c on c.id = i.client_id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment','Refund','Sale')
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND st.name IN ('ARC', 'Supplier', 'CommTrack')
            AND i.client_id IN($3)
            AND sst.name NOT IN (SELECT service_sub_type FROM top_5_cte)
            AND sst.id NOT IN (55)
        GROUP BY c."name", service_sub_type
    )
    SELECT *
    FROM (
        SELECT * FROM top_5_cte
        UNION ALL
        SELECT * FROM others_cte
    ) AS final_result;
`;

export const getClientByTravelSubTypeOther = `
    WITH top_5_cte AS (
        SELECT
            sst.name service_sub_type,
            c."name" client_name,
            COUNT(DISTINCT i.id) AS invoices,
            COUNT(DISTINCT b.id) AS bookings,
            SUM(b.commission_rate) commission,
            SUM(b.total_fare) total_fare
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
            INNER JOIN submit_to st ON st.id = b.submit_to_id
            INNER JOIN profiles c on c.id = i.client_id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment','Refund','Sale')
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND st.name IN ('ARC', 'Supplier', 'CommTrack')
            AND i.client_id IN($3)
        GROUP BY c."name", sst.name
        ORDER BY total_fare DESC
        LIMIT 4
    )
    SELECT
        sst.name service_sub_type,
        c."name" client_name,
        COUNT(DISTINCT i.id) AS invoices,
        COUNT(DISTINCT b.id) AS bookings,
        SUM(b.commission_rate) commission,
        SUM(b.total_fare) total_fare
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
        INNER JOIN submit_to st ON st.id = b.submit_to_id
        INNER JOIN profiles c on c.id = i.client_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND st.name IN ('ARC', 'Supplier', 'CommTrack')
        AND sst.name NOT IN (SELECT service_sub_type FROM top_5_cte)
        AND sst.id NOT IN (55)
        AND i.client_id IN($3)
    GROUP BY c."name", sst.name
    ORDER BY total_fare DESC
`;

export const getClientProductivityHistoryByAirline = `
    WITH BookingAgentId AS (
        SELECT
            ab.invoice_id,
            ab.booking_id,
            MIN(ab.agent_id) AS agent_id
        FROM agents_booking ab
        WHERE ab.action_id = 1
        GROUP BY ab.invoice_id, ab.booking_id
    )
    SELECT
        v.id id,
        v.name name,
        COUNT(DISTINCT i.id) AS invoices,
        COUNT(DISTINCT b.id) AS bookings,
        SUM(b.commission_rate) commission,
        SUM(b.total_fare) total_fare
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN service_type stt ON stt.id = sst.service_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
        INNER JOIN submit_to st ON st.id = b.submit_to_id
        INNER JOIN profiles v ON v.id = b.vendor_id
        LEFT JOIN BookingAgentId bai ON bai.invoice_id = i.id
            AND bai.booking_id = b.id
        LEFT JOIN profiles abp ON abp.id = bai.agent_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND st.name IN ('ARC', 'Supplier', 'CommTrack')
        AND stt.name IN('Air')
        AND b.e_ticket_ind IN('1')
        AND i.client_id IN($3)
    GROUP BY v.name, v.id
    ORDER BY v.name
`;

export const getClientProductivityHistoryByAgent = `
    WITH BookingAgentId AS (
        SELECT
            ab.invoice_id,
            ab.booking_id,
            MIN(ab.agent_id) AS agent_id
        FROM agents_booking ab
        WHERE ab.action_id = 1
        GROUP BY ab.invoice_id, ab.booking_id
    )
    SELECT
        bai.agent_id id,
        abp."name" name,
        COUNT(DISTINCT i.id) AS invoices,
        COUNT(DISTINCT b.id) AS bookings,
        SUM(b.commission_rate) commission,
        SUM(b.total_fare) total_fare
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
        INNER JOIN submit_to st ON st.id = b.submit_to_id
        INNER JOIN profiles c on c.id = i.client_id
        LEFT JOIN BookingAgentId bai ON bai.invoice_id = i.id
            AND bai.booking_id = b.id
        LEFT JOIN profiles abp ON abp.id = bai.agent_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND st.name IN ('ARC', 'Supplier', 'CommTrack')
        AND i.client_id IN($3)
    GROUP BY abp.name, bai.agent_id
    ORDER BY abp.name
`;

export const getClientProductivityHistoryByAirlineTop = `
    SELECT
        v.name name,
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
        AND st.name IN ('ARC', 'Supplier', 'CommTrack')
        AND stt.name IN('Air')
        AND b.e_ticket_ind IN('1')
        AND v.id = ANY($3)
        AND i.client_id IN($4)
    GROUP BY v.name, EXTRACT(YEAR FROM i.issue_date)
`;

export const getClientProductivityHistoryByAgentTop = `
    WITH BookingAgentId AS (
        SELECT
            ab.invoice_id,
            ab.booking_id,
            MIN(ab.agent_id) AS agent_id
        FROM agents_booking ab
        WHERE ab.action_id = 1
        GROUP BY ab.invoice_id, ab.booking_id
    )
    SELECT
        abp."name" name,
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
        LEFT JOIN BookingAgentId bai ON bai.invoice_id = i.id
            AND bai.booking_id = b.id
        LEFT JOIN profiles abp ON abp.id = bai.agent_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND st.name IN ('ARC', 'Supplier', 'CommTrack')
        AND bai.agent_id = ANY($3)
        AND c.id IN($4)
    GROUP BY abp."name", EXTRACT(YEAR FROM i.issue_date)
`;
