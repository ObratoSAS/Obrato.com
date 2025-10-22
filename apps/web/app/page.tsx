import Link from 'next/link';
import { Button } from '@obrato/ui';

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-xl bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Aprende y enseña sin límites</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Obrato LMS ofrece una experiencia integral para instituciones educativas y empresas que
          buscan gestionar aprendizaje en línea con accesibilidad, seguridad y escalabilidad.
        </p>
        <div className="mt-6 flex gap-4">
          <Button asChild>
            <Link href="/courses">Explorar cursos</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/(auth)/register">Crear cuenta</Link>
          </Button>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {[ 
          {
            title: 'Gestión completa',
            description:
              'Cursos, calificaciones, SCORM, rúbricas y foros en un solo lugar con control granular de permisos.'
          },
          {
            title: 'Analítica accionable',
            description:
              'Reportes y paneles para entender el progreso, detectar riesgos y automatizar intervenciones.'
          },
          {
            title: 'Extensible y seguro',
            description:
              'Plugins, APIs abiertas, autenticación multifactor y cumplimiento normativo listo para producción.'
          }
        ].map((feature) => (
          <article key={feature.title} className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
