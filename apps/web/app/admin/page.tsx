'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@obrato/lib';

async function getAdminData() {
  const [users, plugins] = await Promise.all([api.get('/users'), api.get('/plugins')]);
  return { users: users.data, plugins: plugins.data };
}

export default function AdminPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['admin'], queryFn: getAdminData, retry: false });

  if (isLoading) {
    return <p className="text-sm text-slate-500">Cargando administración...</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-red-600">No fue posible cargar la consola de administración.</p>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Administración</h1>
        <p className="text-sm text-slate-600">
          Gestiona usuarios, roles y plugins desde esta consola. Para acciones avanzadas consulta la
          documentación de API y CLI.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Usuarios</h2>
          <p className="mt-2 text-sm text-slate-600">Total: {data.users.length}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {data.users.slice(0, 5).map((user: any) => (
              <li key={user.id} className="flex items-center justify-between">
                <span>{user.fullName}</span>
                <span className="text-slate-500">{user.email}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Plugins</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {data.plugins.map((plugin: any) => (
              <li key={plugin.id} className="flex items-center justify-between">
                <span>{plugin.name}</span>
                <span className="text-slate-500">v{plugin.version}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
