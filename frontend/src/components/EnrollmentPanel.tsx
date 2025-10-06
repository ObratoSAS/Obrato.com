import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FormEvent, useMemo, useState } from 'react'
import { api } from '../services/api'
import { Course, CreateEnrollmentPayload, Enrollment, Student } from '../types'
import '../styles/panel.css'

// Panel responsable de gestionar las inscripciones de estudiantes en materias.

interface EnrollmentPanelProps {
  student: Student | null
  students: Student[]
  courses: Course[]
  enrollments: Enrollment[]
  onStudentChange: (id: number | null) => void
  onInvalidate: (key: string[]) => Promise<void>
}

const initialEnrollment: CreateEnrollmentPayload = {
  studentId: 0,
  courseId: 0,
  finalGrade: undefined
}

export function EnrollmentPanel ({ student, students, courses, enrollments, onStudentChange, onInvalidate }: EnrollmentPanelProps): JSX.Element {
  const [form, setForm] = useState<CreateEnrollmentPayload>(initialEnrollment)

  // Mutación que envía al backend la solicitud de inscripción.
  const createEnrollment = useMutation({
    mutationFn: async (payload: CreateEnrollmentPayload) => await api.post('/enrollments', payload),
    onSuccess: async () => {
      await onInvalidate(['enrollments'])
      await onInvalidate(['students'])
      setForm(initialEnrollment)
    }
  })

  // Se filtran las materias para que sólo aparezcan las del programa del estudiante seleccionado.
  const filteredCourses = useMemo(() => {
    if (!student) return courses
    return courses.filter(course => course.program.id === student.program.id)
  }, [courses, student])

  // Las inscripciones mostradas corresponden exclusivamente al estudiante elegido.
  const studentEnrollments = useMemo(() => {
    if (!student) return []
    return enrollments.filter(enrollment => enrollment.student.id === student.id)
  }, [enrollments, student])

  // Controla el envío del formulario respetando validaciones mínimas.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (form.studentId === 0 || form.courseId === 0) return
    void createEnrollment.mutateAsync(form)
  }

  return (
    <article className="panel">
      <header className="panel__header">
        <div>
          <h2>Inscripciones</h2>
          <p>{enrollments.length} inscripciones activas</p>
        </div>
      </header>
      <section className="panel__content">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__row">
            <label>Estudiante
              <select value={form.studentId} onChange={event => { const id = Number(event.target.value); setForm({ ...form, studentId: id }); onStudentChange(id || null) }} required>
                <option value={0}>Selecciona un estudiante</option>
                {students.map(option => (
                  <option key={option.id} value={option.id}>{option.firstName} {option.lastName}</option>
                ))}
              </select>
            </label>
            <label>Materia
              <select value={form.courseId} onChange={event => setForm({ ...form, courseId: Number(event.target.value) })} required>
                <option value={0}>Selecciona una materia</option>
                {filteredCourses.map(course => (
                  <option key={course.id} value={course.id}>{course.code} · {course.name}</option>
                ))}
              </select>
            </label>
          </div>
          <label>Nota final (opcional)
            <input type="number" min={0} max={5} step={0.1} value={form.finalGrade ?? ''} onChange={event => setForm({ ...form, finalGrade: event.target.value ? Number(event.target.value) : undefined })} />
          </label>
          <footer className="form__footer">
            <button className="button button--primary" type="submit" disabled={createEnrollment.isLoading}>Registrar inscripción</button>
          </footer>
        </form>
        {student ? (
          <div className="list">
            {studentEnrollments.length > 0 ? studentEnrollments.map(enrollment => (
              <div key={enrollment.id} className="card">
                <header>
                  <h3>{enrollment.course.name}</h3>
                  <span>{enrollment.course.code}</span>
                </header>
                <p>{student.firstName} {student.lastName}</p>
                <div className="card__meta">
                  <span>Nota: {enrollment.finalGrade ?? 'Pendiente'}</span>
                  <span>{dayjs(enrollment.createdAt).format('DD/MM/YYYY')}</span>
                </div>
                {enrollment.classmates.length > 0 && (
                  <div>
                    <strong>Comparte clase con:</strong>
                    <ul className="card__companions">
                      {enrollment.classmates.map(partner => (
                        <li key={partner}>{partner}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )) : <p>No hay inscripciones registradas para este estudiante.</p>}
          </div>
        ) : (
          <p className="panel__empty">Selecciona un estudiante para consultar sus inscripciones.</p>
        )}
      </section>
    </article>
  )
}
