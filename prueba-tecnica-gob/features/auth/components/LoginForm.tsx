'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/authSchema';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export function LoginForm() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    const result = await login(data);
    if (!result.success) {
      setServerError(result.error || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {serverError && (
        <div className='rounded-md bg-red-50 p-4 dark:bg-red-900/20'>
          <p className='text-sm text-red-700 dark:text-red-400'>
            {serverError}
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'
        >
          Email
        </label>
        <input
          {...register('email')}
          type='email'
          id='email'
          autoComplete='email'
          className='mt-1 block w-full rounded-lg border border-zinc-300 px-4 py-3 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white'
          placeholder='usuario@ejemplo.com'
        />
        {errors.email && (
          <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'
        >
          Contraseña
        </label>
        <input
          {...register('password')}
          type='password'
          id='password'
          autoComplete='current-password'
          className='mt-1 block w-full rounded-lg border border-zinc-300 px-4 py-3 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white'
          placeholder='••••••••'
        />
        {errors.password && (
          <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {isSubmitting ? (
          <span className='flex items-center gap-2'>
            <svg
              className='h-4 w-4 animate-spin'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
            Iniciando sesión...
          </span>
        ) : (
          'Iniciar sesión'
        )}
      </button>
    </form>
  );
}
