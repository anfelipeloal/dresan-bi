/* Booking Data Inquiry */
export const byBookings = `
    WITH BookingAgentId AS (
        SELECT
            ab.invoice_id,
            ab.booking_id,
            ab.action_id,
            MIN(ab.agent_id) AS agent_id
        FROM agents_booking ab
        GROUP BY ab.invoice_id, ab.booking_id, ab.action_id
    )
    SELECT  
        b.passenger_name,
        b.confirm_no,
        b.starting_ticket_no,
        b.total_fare,
        b.commission_rate commission,
        i.number invoice_number,
        i.id invoice_id,
        i.issue_date,
        i.record_locator pnr,
        it.name inv_type,
        br.name branch,
        st.name submit_to,
        v.name vendor_name,
        c.name client_name,
        cps.name client_status,
        vps.name vendor_status,
        bu.name business_unit,
        sst.name service_sub_type,
        abp."name" agent,
        bai.action_id
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
        INNER JOIN business_units bu ON bu.id = c.business_unit
        INNER JOIN branches br ON br.id = i.branch_id
        LEFT JOIN BookingAgentId bai ON bai.invoice_id = i.id
            AND bai.booking_id = b.id
        LEFT JOIN profiles abp ON abp.id = bai.agent_id
    WHERE i.invoice_type_id IN (1, 3, 4)
`;

export const bookingByInvoices = `
    WITH BookingAgentId AS (
        SELECT
            ab.invoice_id,
            ab.booking_id,
            MIN(ab.agent_id) AS agent_id
        FROM agents_booking ab
        GROUP BY ab.invoice_id, ab.booking_id
    )
    SELECT
        b.id booking_id,    
        i.issue_date,
        i.id invoice_id,
        i."number" invoice_number,
        i.record_locator pnr,
        it."name" inv_type,
        br."name" branch,
        c.name client_name,
        st.name submit_to,
        sst.name service_sub_type,
        v.name vendor_name,
        b.passenger_name,
        b.total_fare,
        b.commission_rate commission,
        cps.name client_status,
        vps.name vendor_status,
        abp."name" agent,
        bu.name business_unit
    FROM bookings b
        INNER JOIN invoices i ON i.id = b.invoice_id
        INNER JOIN invoice_types it ON it.id = i.invoice_type_id
        INNER JOIN service_sub_type sst ON sst.id = b.service_sub_type_id
        INNER JOIN payment_status cps ON cps.id = b.client_payment_status_id
        INNER JOIN payment_status vps ON vps.id = b.vendor_payment_status_id
        INNER JOIN submit_to st ON st.id = b.submit_to_id
        INNER JOIN profiles c on c.id = i.client_id
        INNER JOIN profiles v on v.id = b.vendor_id
        INNER JOIN business_units bu ON bu.id = c.business_unit
        INNER JOIN branches br ON br.id = i.branch_id
        LEFT JOIN BookingAgentId bai ON bai.invoice_id = i.id
            AND bai.booking_id = b.id
        INNER JOIN profiles abp ON abp.id = bai.agent_id
    WHERE i.id = ANY($1)
`;

export const getBookingAgents = `
    WITH BookingAgentId AS (
        SELECT
            ab.invoice_id,
            ab.booking_id,
            ab.action_id,
            ab.agent_id
        FROM agents_booking ab
    )
    SELECT 
        abp."name" agent,
        CASE
            WHEN bai.action_id = 1 THEN 'Booking'
            WHEN bai.action_id = 2 THEN 'Ticketing'
            WHEN bai.action_id = 3 THEN 'N/A'
        END AS action
    FROM invoices i
        INNER JOIN bookings b ON b.invoice_id = i.id
        LEFT JOIN BookingAgentId bai ON bai.invoice_id = i.id
            AND bai.booking_id = b.id
        INNER JOIN profiles abp ON abp.id = bai.agent_id
    WHERE b.id = $1
`;

export const getClients = `
    SELECT id, name FROM profiles
    WHERE is_active IS TRUE
        AND profile_type_id = 2
        AND LOWER(name) LIKE LOWER($1)
    ORDER BY id ASC
    LIMIT 15
`;

export const getProfile = `
    SELECT id, name, interface_id
    FROM profiles p 
    WHERE is_active IS TRUE
        AND id IN($1)
`;

export const getVendors = `
    SELECT id, name FROM profiles
    WHERE is_active IS TRUE
        AND profile_type_id = 3
        AND LOWER(name) LIKE LOWER($1)
    ORDER BY id ASC
    LIMIT 15
`;

export const getTravelSubTypes = `
    SELECT id, name
    FROM service_sub_type
`;
