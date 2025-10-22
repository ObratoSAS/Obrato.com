'use client';

import { useQuery } from '@tanstack/react-query';
import { getActivity } from '@obrato/lib';
import Link from 'next/link';

export default function LearningPage({
  params,
  searchParams
}: {
  params: { courseId: string };
  searchParams: { activity?: string };
}) {
  const activityId = searchParams.activity;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['activity', params.courseId, activityId],
    queryFn: () => (activityId ? getActivity(params.courseId, activityId) : null),
    enabled: Boolean(activityId),
    retry: false
  });

  if (!activityId) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Selecciona una actividad desde el curso.</p>
        <Link className="text-primary-600" href={`/courses/${params.courseId}`}>
          Volver al curso
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500">Cargando actividad...</p>;
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">No se pudo cargar la actividad solicitada.</p>
        <Link className="text-primary-600" href={`/courses/${params.courseId}`}>
          Volver al curso
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{data.title}</h1>
        <p className="mt-3 text-slate-600">{data.description}</p>
        <div className="mt-4 flex gap-4 text-sm text-slate-500">
          <span>Tipo: {data.type}</span>
          {data.maxScore ? <span>Puntuación máxima: {data.maxScore}</span> : null}
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Interacciones</h2>
        <p className="mt-2 text-sm text-slate-600">
          Las entregas y calificaciones se gestionan desde la API en esta versión MVP. Consulta la
          sección de tareas y cuestionarios en próximas iteraciones para experiencias enriquecidas.
        </p>
      </div>
      <Link className="text-sm text-primary-600" href={`/courses/${params.courseId}`}>
        &larr; Regresar al curso
      </Link>
    </div>
  );
}
