export default class CorporateManager {
    processOBTAdoptions(totalBookings, onlineBookings) {
        const result = {};

        totalBookings.forEach((booking) => {
            result[booking.service_type] = {
                service_type: booking.service_type,
                total_bookings: parseInt(booking.bookings, 10),
                online_bookings: 0,
                percentage: '0.00%',
            };
        });

        onlineBookings.forEach((booking) => {
            if (result[booking.service_type]) {
                result[booking.service_type].online_bookings = parseInt(booking.bookings, 10);

                const total = result[booking.service_type].total_bookings;
                const online = result[booking.service_type].online_bookings;

                const percentage = total > 0 ? (online / total) * 100 : 0;
                result[booking.service_type].percentage = parseInt(percentage, 10);
            }
        });

        return result;
    }
}
