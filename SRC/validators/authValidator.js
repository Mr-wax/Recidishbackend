import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,16}$/;

export const passwordValidator = z.string()
  .min(6, { message: 'Password should be at least 6 characters long' })
  .max(16, { message: 'Password should not exceed 16 characters' })
  .regex(passwordRegex, {
    message: 'Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  });

export const signUpValidator = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    password: passwordValidator,
    confirmPassword: passwordValidator,
    email: z.string().email({ message: 'Invalid email address' }).min(3).max(30),
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
  email: z.string().email({ message: 'Invalid email address' }),
  password: passwordValidator,
}).required({ message: 'Please enter all the required fields' });

export const formatZodError = (issues) => {
  return issues.map(issue => ({
    path: issue.path.join('.'),
    message: issue.message
  }));
};

export default { signInValidator, signUpValidator, passwordValidator, formatZodError };
