'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '@obrato/lib';
import { Button } from '@obrato/ui';

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  twoFactorToken: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password, values.twoFactorToken);
      router.push('/dashboard');
    } catch (err) {
      setError('No fue posible iniciar sesión. Verifica tus credenciales.');
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Inicia sesión</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:border-primary-600 focus:outline-none"
            autoComplete="email"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:border-primary-600 focus:outline-none"
            autoComplete="current-password"
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="twoFactorToken">
            Token 2FA (opcional)
          </label>
          <input
            id="twoFactorToken"
            type="text"
            {...register('twoFactorToken')}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:border-primary-600 focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </div>
  );
}
