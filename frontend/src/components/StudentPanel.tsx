import { useMutation } from '@tanstack/react-query'
import { FormEvent, useMemo, useState } from 'react'
import { api } from '../services/api'
import { CreateStudentPayload, Program, Student } from '../types'
import '../styles/panel.css'

interface StudentPanelProps {
  students: Student[]
  programs: Program[]
  onSelect: (id: number | null) => void
  selectedStudentId: number | null
  onInvalidate: (key: string[]) => Promise<void>
}

const initialStudent: CreateStudentPayload = {
  document: '',
  firstName: '',
  lastName: '',
  programId: 0
}

export function StudentPanel ({ students, programs, onSelect, selectedStudentId, onInvalidate }: StudentPanelProps): JSX.Element {
  const [form, setForm] = useState<CreateStudentPayload>(initialStudent)

  const createStudent = useMutation({
    mutationFn: async (payload: CreateStudentPayload) => await api.post('/students', payload),
    onSuccess: async () => {
      await onInvalidate(['students'])
      setForm(initialStudent)
    }
  })

  const sortedStudents = useMemo(() => [...students].sort((a, b) => a.firstName.localeCompare(b.firstName)), [students])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.document.trim() || !form.firstName.trim() || !form.lastName.trim() || form.programId === 0) return
    void createStudent.mutateAsync(form)
  }

  return (
    <article className="panel">
      <header className="panel__header">
        <div>
          <h2>Estudiantes</h2>
          <p>{students.length} estudiantes registrados en {programs.length} programas</p>
        </div>
      </header>
      <section className="panel__content">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__row">
            <label>Documento
              <input value={form.document} onChange={event => setForm({ ...form, document: event.target.value })} required />
            </label>
            <label>Programa
              <select value={form.programId} onChange={event => setForm({ ...form, programId: Number(event.target.value) })} required>
                <option value={0}>Selecciona un programa</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form__row">
            <label>Nombres
              <input value={form.firstName} onChange={event => setForm({ ...form, firstName: event.target.value })} required />
            </label>
            <label>Apellidos
              <input value={form.lastName} onChange={event => setForm({ ...form, lastName: event.target.value })} required />
            </label>
          </div>
          <footer className="form__footer">
            <button className="button button--primary" type="submit" disabled={createStudent.isLoading}>Registrar estudiante</button>
          </footer>
        </form>
        <div className="list list--two-columns">
          {sortedStudents.map(student => (
            <button
              key={student.id}
              className={`card card--selectable ${selectedStudentId === student.id ? 'card--selected' : ''}`}
              type="button"
              onClick={() => onSelect(selectedStudentId === student.id ? null : student.id)}
            >
              <header>
                <h3>{student.firstName} {student.lastName}</h3>
                <span>{student.program.name}</span>
              </header>
              <p>Documento: {student.document}</p>
              <div className="card__meta">
                <span>{student.enrollments.length} inscripciones</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </article>
  )
}
