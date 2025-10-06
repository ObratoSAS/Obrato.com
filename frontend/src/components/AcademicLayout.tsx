import { PropsWithChildren } from 'react'
import { RefreshCcw } from 'lucide-react'
import '../styles/layout.css'

// Layout maestro que añade cabecera y contenedor principal.

type AcademicLayoutProps = PropsWithChildren<{
  isLoading: boolean
  onRefresh: () => void
}>

export function AcademicLayout ({ children, isLoading, onRefresh }: AcademicLayoutProps): JSX.Element {
  return (
    <div className="layout">
      <header className="layout__header">
        <div>
          <h1>Plataforma de Registro Académico</h1>
          <p>Gestiona programas, estudiantes, materias e inscripciones desde un solo lugar.</p>
        </div>
        <button className="button" type="button" onClick={onRefresh} disabled={isLoading}>
          <RefreshCcw size={18} />
          Actualizar
        </button>
      </header>
      <main className="layout__content">
        {children}
      </main>
    </div>
  )
}
