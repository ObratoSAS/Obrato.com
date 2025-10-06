// Tipos compartidos entre los componentes React y los servicios HTTP.

export interface Professor {
  /** Identificador único del profesor */
  id: number
  /** Nombre completo mostrado en la interfaz */
  fullName: string
  /** Correo de contacto */
  email: string
}

export interface CourseSummary {
  /** Identificador de la materia */
  id: number
  /** Código corto con el que se registra la materia */
  code: string
  /** Nombre completo de la materia */
  name: string
  /** Créditos fijos (3 según la regla de negocio) */
  credits: number
  /** Profesor asignado cuando se consulta desde programas */
  professor?: Professor
}

export interface Program {
  /** Identificador de programa */
  id: number
  /** Nombre descriptivo */
  name: string
  /** Descripción breve */
  description: string
  /** Créditos requeridos para graduarse */
  requiredCredits: number
  /** Materias asociadas */
  courses: CourseSummary[]
  /** Número de estudiantes vinculados */
  studentCount: number
}

export interface Course {
  id: number
  code: string
  name: string
  credits: number
  program: {
    id: number
    name: string
  }
  professor: Professor
}

export interface Student {
  id: number
  document: string
  firstName: string
  lastName: string
  program: {
    id: number
    name: string
  }
  /** Inscripciones que muestran compañeros de clase */
  enrollments: Enrollment[]
}

export interface Enrollment {
  id: number
  student: {
    id: number
    fullName: string
    document: string
  }
  course: {
    id: number
    code: string
    name: string
  }
  /** Calificación final opcional */
  finalGrade?: number
  /** Nombres de hasta dos compañeros con quienes comparte la clase */
  classmates: string[]
  createdAt: string
}

export interface CreateProgramPayload {
  name: string
  description: string
  requiredCredits: number
}

export interface CreateCoursePayload {
  code: string
  name: string
  credits: number
  programId: number
  professorId: number
}

export interface CreateStudentPayload {
  document: string
  firstName: string
  lastName: string
  programId: number
}

export interface CreateEnrollmentPayload {
  studentId: number
  courseId: number
  finalGrade?: number
}
