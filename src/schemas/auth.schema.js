import { z } from 'zod';

export default class AuthSchema {
    static authRegisterValidation = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8, 'Password must contain at least 8 characters'),
        confirmPassword: z.string().min(8, 'Confirm Password must contain at least 8 characters'),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords don\'t match',
        path: ['confirmPassword'],
    });

    static authLoginValidation = z.object({
        email: z.string().email(),
        password: z.string().min(8, 'Password must contain at least 8 characters'),
    });
}
