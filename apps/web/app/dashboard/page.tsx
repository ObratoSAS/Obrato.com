'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '@obrato/lib';
import Link from 'next/link';

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard, retry: false });

  if (isLoading) {
    return <p className="text-sm text-slate-500">Cargando tu panel...</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-red-600">No fue posible cargar tu panel. Inicia sesión nuevamente.</p>;
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Tus cursos</h1>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {data.courses.map((course: any) => (
            <article key={course.id} className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{course.fullName}</h2>
              <p className="mt-2 text-sm text-slate-600">{course.summary}</p>
              <Link className="mt-4 inline-flex text-sm text-primary-600" href={`/courses/${course.id}`}>
                Ir al curso
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-slate-900">Notificaciones recientes</h2>
        <ul className="mt-3 space-y-2">
          {data.notifications.length === 0 && (
            <li className="text-sm text-slate-500">Sin notificaciones pendientes.</li>
          )}
          {data.notifications.map((notification: any) => (
            <li key={notification.id} className="rounded-md bg-white p-3 text-sm shadow-sm">
              <p className="font-medium text-slate-900">{notification.type}</p>
              <p className="text-slate-600">{JSON.stringify(notification.payload)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
