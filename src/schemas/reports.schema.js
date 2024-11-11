import { z } from 'zod';

export default class ReportsSchema {
    static startAndEndDate = z.object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date().max(new Date(), {
            message: 'End Date should be less or equal than today\'s date',
        }),
    });
}
