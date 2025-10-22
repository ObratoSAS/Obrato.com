'use client';

import { useQuery } from '@tanstack/react-query';
import { getCourse } from '@obrato/lib';
import Link from 'next/link';

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['course', params.courseId],
    queryFn: () => getCourse(params.courseId),
    retry: false
  });

  if (isLoading) {
    return <p className="text-sm text-slate-500">Cargando curso...</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-red-600">No se pudo cargar el curso solicitado.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{data.fullName}</h1>
        <p className="mt-3 text-slate-600">{data.summary}</p>
        <div className="mt-4 flex gap-4 text-sm text-slate-500">
          <span>Formato: {data.format}</span>
          <span>Idioma: {data.language}</span>
        </div>
      </div>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Secciones</h2>
        <div className="space-y-3">
          {data.sections?.map((section: any) => (
            <article key={section.id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{section.name}</h3>
                <span className="text-xs uppercase text-slate-400">{section.visible ? 'Visible' : 'Oculto'}</span>
              </div>
              {section.summary && <p className="mt-2 text-sm text-slate-600">{section.summary}</p>}
              <ul className="mt-3 space-y-2 text-sm">
                {section.activities?.map((activity: any) => (
                  <li key={activity.id} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                    <div>
                      <p className="font-medium text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-500">Tipo: {activity.type}</p>
                    </div>
                    <Link className="text-primary-600" href={`/learning/${data.id}?activity=${activity.id}`}>
                      Abrir
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
