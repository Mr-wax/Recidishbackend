import { z } from 'zod';

export const signUpValidator = z
    .object({
        name: z.string(),
        password: z
            .string()
            .min(6, { message: 'Password should be at least 6 characters long' })
            .max(10, { message: 'Password should not exceed 10 characters' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/, {
                message: 'Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            }),
        confirmPassword: z.string()
            .min(6, { message: 'Password should be at least 6 characters long' })
            .max(10, { message: 'Password should not exceed 10 characters' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/, {
                message: 'Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            }),
        email: z.string().min(3).max(30),
    })
    .refine(data => {
        return data.name && data.email && data.password && data.confirmPassword;
    }, {
        message: 'Please enter all the required fields',
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
    .transform(data => {
        const { confirmPassword, ...rest } = data;
        return rest;
    });


export const signInValidator = z.object({
    email: z.string(),
    password: z.string().min(6).max(10),
}).required({ message: 'Please enter all the required fields' });
