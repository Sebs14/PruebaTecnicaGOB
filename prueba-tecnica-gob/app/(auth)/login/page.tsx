import { LoginForm } from '@/features/auth';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-900'>
      <div className='w-full max-w-md'>
        <div className='rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-800'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <h1 className='text-2xl font-bold text-zinc-900 dark:text-white'>
              EduSystem
            </h1>
            <p className='mt-2 text-zinc-600 dark:text-zinc-400'>
              Sistema de Gestión de Estudiantes
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Footer */}
          <p className='mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400'>
            ¿Problemas para acceder?{' '}
            <a
              href='#'
              className='font-medium text-blue-600 hover:underline dark:text-blue-400'
            >
              Contactar soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
