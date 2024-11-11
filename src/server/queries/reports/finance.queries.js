/* Sales Current Month */
export const salesCurrentMonth = `
    WITH arc_supplier AS (
        SELECT
            sst.id service_id,
            sst.name service_sub_type,
            COUNT(b.id) bookings,
            SUM(b.total_fare) total_fare,
            SUM(b.commission_rate) total_commission
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
            INNER JOIN submit_to st ON st.id = b.submit_to_id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment','Refund','Sale')
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND st."name" IN ('ARC', 'Supplier')
        GROUP BY sst.id, sst.name 
    ),
    commtrack AS (
        SELECT
            sst.id service_id,
            sst.name service_sub_type,
            COUNT(b.id) bookings,
            SUM(b.total_fare) total_fare,
            SUM(b.commission_rate) total_commission
        FROM payments p
            LEFT JOIN payment_details pd ON pd.payment_id = p.id
            INNER JOIN payment_types pt ON pt.id = p.payment_type_id
            INNER JOIN profiles p2 ON p2.id = p.profile_id
            INNER JOIN profile_types pt2 ON pt2.id = p2.profile_type_id
            INNER JOIN bookings b ON b.id = pd.booking_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN submit_to st ON st.id = b.submit_to_id
            INNER JOIN invoices i ON i.id = b.invoice_id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        WHERE p.payment_date BETWEEN $1 AND $2
            AND pt."name" IN('Received','Made')
            AND pt2."name" IN('Vendor')
            AND st.name IN ('CommTrack')
            AND p.is_voided IS NULL
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND vps.name IN('Closed')
            AND it.name IN('Adjustment','Refund','Sale')
        GROUP BY sst.id, sst.name
    )
    SELECT 
        service_id,
        service_sub_type, 
        SUM(bookings) AS bookings,
        SUM(total_fare) AS total_fare,
        SUM(total_commission) AS total_commission
    FROM (
        SELECT * FROM arc_supplier
        UNION ALL
        SELECT * FROM commtrack
    ) AS final_result
    GROUP BY service_id, service_sub_type;
`;

export const budgetSales = `
    SELECT
        glsst.service_sub_type_id,
        SUM(jed.debit_amount) debit_amount,
        SUM(jed.credit_amount) credit_amount
    FROM journal_entry_details jed 
        INNER JOIN journal_entries je ON je.id = jed.journal_entry_id
        INNER JOIN journal_entry_types jet ON jet.id = je.journal_entry_type_id 
        INNER JOIN general_ledger gl ON gl.id = jed.general_ledger_id
        INNER JOIN general_ledger_service_sub_type glsst on glsst.sales_account_id = gl.id
    WHERE jet."name" IN('Budget')
        AND je.creation_date BETWEEN $1 AND $2
    GROUP BY glsst.service_sub_type_id, gl.id
    ORDER BY gl.id
`;

export const budgetCostOfSales = `
    SELECT
        glsst.service_sub_type_id,
        SUM(jed.debit_amount) debit_amount,
        SUM(jed.credit_amount) credit_amount
    FROM journal_entry_details jed 
        INNER JOIN journal_entries je ON je.id = jed.journal_entry_id
        INNER JOIN journal_entry_types jet ON jet.id = je.journal_entry_type_id 
        INNER JOIN general_ledger gl ON gl.id = jed.general_ledger_id
        INNER JOIN general_ledger_service_sub_type glsst on glsst.cost_of_sales_account_id = gl.id
        INNER JOIN general_ledger_branches glb ON glb.id = jed.general_ledger_branch_id
    WHERE jet."name" IN('Budget')
        AND je.creation_date BETWEEN $1 AND $2
        AND glb."name" IN('In House - BTM')
    GROUP BY glsst.service_sub_type_id, gl.id
    ORDER BY gl.id
`;

export const salesCurrentMonthDetailded = `
    WITH arc_supplier AS (
        SELECT
            i.issue_date "date",
            b.service_sub_type_id,
            sst.name service_sub_type,
            i.number "INV",
            v.name "vendor_name",
            c.name "client_name",
            b.passenger_name,
            b.total_fare,
            b.commission_rate commission
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN profiles c on c.id = i.client_id
            INNER JOIN profiles v ON v.id = b.vendor_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
            INNER JOIN submit_to st ON st.id = b.submit_to_id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment','Refund','Sale')
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND st."name" IN ('ARC', 'Supplier')
            AND b.service_sub_type_id IN($3)
    ),
    commtrack AS (
        SELECT
            i.issue_date "date",
            b.service_sub_type_id,
            sst.name service_sub_type,
            i.number "INV",
            v.name "Vendor Name",
            c.name "Client Name",
            b.passenger_name,
            b.total_fare,
            b.commission_rate commission
        FROM payments p
            LEFT JOIN payment_details pd ON pd.payment_id = p.id
            INNER JOIN payment_types pt ON pt.id = p.payment_type_id
            INNER JOIN profiles p2 ON p2.id = p.profile_id
            INNER JOIN profile_types pt2 ON pt2.id = p2.profile_type_id
            INNER JOIN bookings b ON b.id = pd.booking_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN submit_to st ON st.id = b.submit_to_id
            INNER JOIN invoices i ON i.id = b.invoice_id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN profiles c on c.id = i.client_id
            INNER JOIN profiles v ON v.id = b.vendor_id
        WHERE p.payment_date BETWEEN $1 AND $2
            AND pt."name" IN('Received','Made')
            AND pt2."name" IN('Vendor')
            AND st.name IN ('CommTrack')
            AND p.is_voided IS NULL
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND vps.name IN('Closed')
            AND it.name IN('Adjustment','Refund','Sale')
            AND b.service_sub_type_id IN($3)
    )
    SELECT *
    FROM (
        SELECT * FROM arc_supplier
        UNION ALL
        SELECT * FROM commtrack
    ) AS final_result;
`;

/* Total Sales P&L */
export const byTotalSalesReport = `
    SELECT
        i.issue_date pyl_date,
        i."number" invoice_number,
        sst.name service_sub_type,
        c."name" client_name,
        v."name" vendor_name,
        i.pnr_creation_date,
        b.total_fare,
        b.commission_rate commission,
        B.passenger_name,
        b.confirm_no,
        B.starting_ticket_no ticket_no
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
        INNER JOIN submit_to st ON st.id = b.submit_to_id
        INNER JOIN profiles c on c.id = i.client_id
        INNER JOIN profiles v on v.id = b.vendor_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND vps.name IN('Open', 'Closed', 'N/A')
        AND tt2."name" IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
        AND sst.name IN ('Dom. Air', 'Intl Air')
        AND st."name" IN ('ARC', 'Supplier')
        AND b.e_ticket_ind = '1'


    UNION ALL

    SELECT
        i.issue_date pyl_date,
        i."number" invoice_number,
        sst.name service_sub_type,
        c."name" client_name,
        v."name" vendor_name,
        i.pnr_creation_date,
        b.total_fare,
        b.commission_rate commission,
        b.passenger_name,
        b.confirm_no,
        B.starting_ticket_no ticket_no
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
        INNER JOIN profiles c on c.id = i.client_id
        INNER JOIN profiles v on v.id = b.vendor_id
    WHERE i.issue_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND vps.name IN('Open', 'Closed', 'N/A')
        AND tt2."name" IN('Normal', 'Ex-Add-Coll', 'Ex-Refund')
        AND sst.name IN ('Service Fee', 'Insurance', 'Misc.', 'CC Merch Fee Serv', 'Charge Back Fee')


    UNION ALL

    SELECT
        p.payment_date pyl_date,
        i."number" invoice_number,
        sst.name service_sub_type,
        c."name" client_name,
        v."name" vendor_name,
        i.pnr_creation_date,
        b.total_fare,
        b.commission_rate commission,
        b.passenger_name,
        b.confirm_no,
        B.starting_ticket_no ticket_no
    FROM payments p
        INNER JOIN payment_details pd ON pd.payment_id = p.id
        LEFT JOIN bookings b ON b.id = pd.booking_id
        LEFT JOIN invoices i ON i.id = b.invoice_id
        LEFT JOIN profiles c ON c.id = i.client_id
        LEFT JOIN profiles v ON v.id = b.vendor_id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
        INNER JOIN submit_to st ON st.id = p.submit_to_id
    WHERE p.payment_date BETWEEN $1 AND $2
        AND it.name IN('Adjustment','Refund','Sale')
        AND cps.name IN('Open', 'Closed', 'N/A')
        AND vps.name IN('Closed')
        AND sst.name IN ('Hotel', 'Car', 'Limo', 'Cruice', 'Tour', 'Rail', 'Seats')
        AND st."name" IN ('CommTrack')
`;

/* Business Units Earnings and Cost */
export const byBusinessUnitEarningsAndCost = `
    WITH arc_supplier AS (
        SELECT
            CASE
                WHEN sst.name IN('Dom. Air', 'Intl Air') THEN sst.name || ' - ' || v.name
                ELSE sst.name
            END service_sub_type,
            b.service_sub_type_id,
            COALESCE(SUM(CASE WHEN bu."name" = 'CORPORATE' THEN b.total_fare ELSE 0 END), 0) AS "CORPORATE",
            COALESCE(SUM(CASE WHEN bu."name" = 'CONSOLIDATOR' THEN b.total_fare ELSE 0 END), 0) AS "CONSOLIDATOR",
            COALESCE(SUM(CASE WHEN bu."name" = 'IC UNIT' THEN b.total_fare ELSE 0 END), 0) AS "IC_UNIT",
            COALESCE(SUM(CASE WHEN bu."name" = 'LEISURE' THEN b.total_fare ELSE 0 END), 0) AS "LEISURE"
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN profiles c ON c.id = i.client_id
            INNER JOIN business_units bu ON bu.id = c.business_unit
            INNER JOIN profiles v ON v.id = b.vendor_id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
            INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
            INNER JOIN service_sub_type sst on sst.id = b.service_sub_type_id
            INNER JOIN submit_to st ON st.id = b.submit_to_id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment', 'Refund', 'Sale')
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND st."name" IN ('ARC', 'Supplier')
        GROUP BY service_sub_type, b.service_sub_type_id
    ),
    commtrack AS (
        SELECT
            CASE
                WHEN sst.name IN('Dom. Air', 'Intl Air') THEN sst.name || ' - ' || v.name
                ELSE sst.name
            END service_sub_type,
            b.service_sub_type_id,
            COALESCE(SUM(CASE WHEN bu."name" = 'CORPORATE' THEN b.total_fare ELSE 0 END), 0) AS "CORPORATE",
            COALESCE(SUM(CASE WHEN bu."name" = 'CONSOLIDATOR' THEN b.total_fare ELSE 0 END), 0) AS "CONSOLIDATOR",
            COALESCE(SUM(CASE WHEN bu."name" = 'IC UNIT' THEN b.total_fare ELSE 0 END), 0) AS "IC_UNIT",
            COALESCE(SUM(CASE WHEN bu."name" = 'LEISURE' THEN b.total_fare ELSE 0 END), 0) AS "LEISURE"
        FROM payments p
            LEFT JOIN payment_details pd ON pd.payment_id = p.id
            INNER JOIN payment_types pt ON pt.id = p.payment_type_id
            INNER JOIN profiles p2 ON p2.id = p.profile_id
            INNER JOIN profile_types pt2 ON pt2.id = p2.profile_type_id
            INNER JOIN bookings b ON b.id = pd.booking_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN submit_to st ON st.id = b.submit_to_id
            INNER JOIN invoices i ON i.id = b.invoice_id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN profiles v ON v.id = b.vendor_id
            INNER JOIN profiles c ON c.id = i.client_id
            INNER JOIN business_units bu ON bu.id = c.business_unit
        WHERE p.payment_date BETWEEN $1 AND $2
            AND pt."name" IN('Received','Made')
            AND pt2."name" IN('Vendor')
            AND st.name IN ('CommTrack')
            AND p.is_voided IS NULL
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND vps.name IN('Closed')
            AND it.name IN('Adjustment','Refund','Sale')
        GROUP BY service_sub_type, b.service_sub_type_id
    )
    SELECT 
        service_sub_type,
        service_sub_type_id,
        SUM(corporate) corporate,
        SUM(consolidator) consolidator,
        SUM(ic_unit) ic_unit,
        SUM(leisure) leisure
    FROM (
        SELECT * FROM arc_supplier
        UNION ALL
        SELECT * FROM commtrack
    ) AS final_result
    GROUP BY service_sub_type, service_sub_type_id
    ORDER BY service_sub_type
`;

/* Business Units Earnings and Cost Detailed */
export const byBusinessUnitEarningsAndCostDetailed = `
    WITH arc_supplier AS (
        SELECT
            TO_CHAR(i.issue_date, 'YYYY-MM-DD') "date",
            sst.name || ' - ' || v.name AS type_vendor,
            sst.name business_type,
            i.number "INV",
            c.name "Client Name",
            b.passenger_name,
            bu."name" business_unit,
            b.total_fare,
            b.commission_rate commission
        FROM invoices i
            INNER JOIN bookings b ON b.invoice_id = i.id
            INNER JOIN profiles c ON c.id = i.client_id
            INNER JOIN business_units bu ON bu.id = c.business_unit
            INNER JOIN profiles v ON v.id = b.vendor_id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
            INNER JOIN ticket_type tt2 ON tt2.id = b.ticket_type_id
            INNER JOIN service_sub_type sst on sst.id = b.service_sub_type_id
            INNER JOIN submit_to st ON st.id = b.submit_to_id
        WHERE i.issue_date BETWEEN $1 AND $2
            AND it.name IN('Adjustment', 'Refund', 'Sale')
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND st."name" IN ('ARC', 'Supplier')
            AND b.service_sub_type_id = $3
    ),
    commtrack AS (
        SELECT
            TO_CHAR(i.issue_date, 'YYYY-MM-DD') "date",
            sst.name || ' - ' || v.name AS type_vendor,
            sst.name business_type,
            i.number "INV",
            c.name "Client Name",
            b.passenger_name,
            bu."name" business_unit,
            b.total_fare,
            b.commission_rate commission
        FROM payments p
            LEFT JOIN payment_details pd ON pd.payment_id = p.id
            INNER JOIN payment_types pt ON pt.id = p.payment_type_id
            INNER JOIN profiles p2 ON p2.id = p.profile_id
            INNER JOIN profile_types pt2 ON pt2.id = p2.profile_type_id
            INNER JOIN bookings b ON b.id = pd.booking_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN submit_to st ON st.id = b.submit_to_id
            INNER JOIN invoices i ON i.id = b.invoice_id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN profiles v ON v.id = b.vendor_id
            INNER JOIN profiles c ON c.id = i.client_id
            INNER JOIN business_units bu ON bu.id = c.business_unit
        WHERE p.payment_date BETWEEN $1 AND $2
            AND pt."name" IN('Received','Made')
            AND pt2."name" IN('Vendor')
            AND st.name IN ('CommTrack')
            AND p.is_voided IS NULL
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND vps.name IN('Closed')
            AND it.name IN('Adjustment','Refund','Sale')
        AND b.service_sub_type_id = $3
    )
    SELECT *
    FROM (
        SELECT * FROM arc_supplier
        UNION ALL
        SELECT * FROM commtrack
    ) AS final_result
    ORDER BY type_vendor, business_type
`;

/* Client Performance */
export const getTotalSalesByMothAndYear = `
    WITH arc_supplier AS (
        SELECT
            bu.name business_unit,
            c.name client,
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
            AND st.name IN ('ARC', 'Supplier')
            AND ($3 = 0 OR bu.id = $3)
        GROUP BY c.name, EXTRACT(YEAR FROM i.issue_date), bu.name
    ),
    commtrack AS (
        SELECT
            bu.name business_unit,
            c.name client,
            EXTRACT(YEAR from p.payment_date) AS "year",
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM p.payment_date) = 1 THEN b.total_fare ELSE 0 END), 0) AS "JANUARY",
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM p.payment_date) = 2 THEN b.total_fare ELSE 0 END), 0) AS "FEBRUARY",
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM p.payment_date) = 3 THEN b.total_fare ELSE 0 END), 0) AS "MARCH",
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM p.payment_date) = 4 THEN b.total_fare ELSE 0 END), 0) AS "APRIL",
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM p.payment_date) = 5 THEN b.total_fare ELSE 0 END), 0) AS "MAY",
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM p.payment_date) = 6 THEN b.total_fare ELSE 0 END), 0) AS "JUNE",
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM p.payment_date) = 7 THEN b.total_fare ELSE 0 END), 0) AS "JULY",
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM p.payment_date) = 8 THEN b.total_fare ELSE 0 END), 0) AS "AUGUST",
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM p.payment_date) = 9 THEN b.total_fare ELSE 0 END), 0) AS "SEPTEMBER",
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM p.payment_date) = 10 THEN b.total_fare ELSE 0 END), 0) AS "OCTOBER",
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM p.payment_date) = 11 THEN b.total_fare ELSE 0 END), 0) AS "NOVEMBER",
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM p.payment_date) = 12 THEN b.total_fare ELSE 0 END), 0) AS "DECEMBER"
        FROM payments p
            LEFT JOIN payment_details pd ON pd.payment_id = p.id
            INNER JOIN payment_types pt ON pt.id = p.payment_type_id
            INNER JOIN profiles p2 ON p2.id = p.profile_id
            INNER JOIN profile_types pt2 ON pt2.id = p2.profile_type_id
            INNER JOIN bookings b ON b.id = pd.booking_id
            INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
            INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
            INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
            INNER JOIN submit_to st ON st.id = b.submit_to_id
            INNER JOIN invoices i ON i.id = b.invoice_id
            INNER JOIN invoice_types it ON it.id = i.invoice_type_id
            INNER JOIN profiles c on c.id = i.client_id
            INNER JOIN profiles v ON v.id = b.vendor_id
            INNER JOIN business_units bu on bu.id = c.business_unit
        WHERE p.payment_date BETWEEN $1 AND $2
            AND pt."name" IN('Received','Made')
            AND pt2."name" IN('Vendor')
            AND st.name IN ('CommTrack')
            AND p.is_voided is null
            AND cps.name IN('Open', 'Closed', 'N/A')
            AND vps.name IN('Closed')
            AND it.name IN('Adjustment','Refund','Sale')
            AND ($3 = 0 OR bu.id = $3)
        GROUP BY c.name, EXTRACT(YEAR FROM p.payment_date), bu.name
    )
    SELECT 
        business_unit,
        client,
        year,
        SUM(january) january,
        SUM(february) february,
        SUM(march) march,
        SUM(april) april,
        SUM(may) may,
        SUM(june) june,
        SUM(july) july,
        SUM(august) august,
        SUM(september) september,
        SUM(october) october,
        SUM(november) november,
        SUM(december) december
    FROM (
        SELECT * FROM arc_supplier
        UNION ALL
        SELECT * FROM commtrack
    ) AS final_result
    GROUP BY client, year, business_unit
    ORDER BY client, year
`;
