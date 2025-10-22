'use client';

import { useQuery } from '@tanstack/react-query';
import { getCourses } from '@obrato/lib';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@obrato/ui';

export default function CoursesPage() {
  const [query, setQuery] = useState('');
  const { data, refetch, isFetching, isError } = useQuery({
    queryKey: ['courses', query],
    queryFn: () => getCourses(query ? { q: query } : undefined),
    retry: false
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-lg bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Catálogo de cursos</h1>
          <p className="text-sm text-slate-600">Explora cursos disponibles y filtra por palabras clave.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar cursos"
            className="w-64 rounded-md border border-slate-200 px-3 py-2 focus:border-primary-600 focus:outline-none"
          />
          <Button onClick={() => refetch()} disabled={isFetching}>
            Buscar
          </Button>
        </div>
      </div>
      {isError && <p className="text-sm text-red-600">No fue posible cargar los cursos.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((course: any) => (
          <article key={course.id} className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{course.fullName}</h2>
            <p className="mt-2 text-sm text-slate-600">{course.summary}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">Formato: {course.format}</span>
              <Link className="text-primary-600" href={`/courses/${course.id}`}>
                Ver detalles
              </Link>
            </div>
          </article>
        ))}
        {data?.length === 0 && (
          <p className="text-sm text-slate-500">No se encontraron cursos para tu búsqueda.</p>
        )}
      </div>
    </div>
  );
}
