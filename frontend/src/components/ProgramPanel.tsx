import { useMutation } from '@tanstack/react-query'
import { FormEvent, useMemo, useState } from 'react'
import { api } from '../services/api'
import { CreateProgramPayload, Professor, Program } from '../types'
import '../styles/panel.css'

interface ProgramPanelProps {
  programs: Program[]
  professors: Professor[]
  onInvalidate: (key: string[]) => Promise<void>
}

const initialProgram: CreateProgramPayload = {
  name: '',
  description: '',
  requiredCredits: 120
}

export function ProgramPanel ({ programs, professors, onInvalidate }: ProgramPanelProps): JSX.Element {
  const [form, setForm] = useState<CreateProgramPayload>(initialProgram)

  const createProgram = useMutation({
    mutationFn: async (payload: CreateProgramPayload) => await api.post('/programs', payload),
    onSuccess: async () => {
      await onInvalidate(['programs'])
      setForm(initialProgram)
    }
  })

  const totalCredits = useMemo(() => programs.reduce((acc, program) => acc + program.requiredCredits, 0), [programs])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.name.trim()) return
    void createProgram.mutateAsync({ ...form })
  }

  return (
    <article className="panel">
      <header className="panel__header">
        <div>
          <h2>Programas académicos</h2>
          <p>{programs.length} programas registrados · {totalCredits} créditos acumulados</p>
        </div>
      </header>
      <section className="panel__content">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__row">
            <label>Nombre
              <input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} required />
            </label>
            <label>Créditos requeridos
              <input type="number" min={1} value={form.requiredCredits} onChange={event => setForm({ ...form, requiredCredits: Number(event.target.value) })} required />
            </label>
          </div>
          <label>Descripción
            <textarea value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} rows={3} />
          </label>
          <footer className="form__footer">
            <button className="button button--primary" type="submit" disabled={createProgram.isLoading}>Registrar programa</button>
          </footer>
        </form>
        <div className="list">
          {programs.map(program => (
            <div key={program.id} className="card">
              <header>
                <h3>{program.name}</h3>
                <span>{program.requiredCredits} créditos</span>
              </header>
              <p>{program.description || 'Sin descripción'}</p>
              <div className="card__meta">
                <span>{program.courses.length} materias</span>
                <span>{program.studentCount} estudiantes</span>
              </div>
              {program.courses.length > 0 && (
                <ul className="card__list">
                  {program.courses.map(course => (
                    <li key={course.id}>
                      <strong>{course.code}</strong>
                      <span>{course.name}</span>
                      <span>{course.credits} créditos · {course.professor?.fullName ?? 'Sin profesor'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
      <footer className="panel__footer">
        <p>Profesores disponibles: {professors.map(professor => professor.fullName).join(', ') || 'Pendiente de registrar'}</p>
      </footer>
    </article>
  )
}
