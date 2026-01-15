import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email es requerido' })
    .email('Email inválido')
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: 'Contraseña es requerida' })
    .min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
