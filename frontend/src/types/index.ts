export interface Professor {
  id: number
  fullName: string
  email: string
}

export interface CourseSummary {
  id: number
  code: string
  name: string
  credits: number
  professor?: Professor
}

export interface Program {
  id: number
  name: string
  description: string
  requiredCredits: number
  courses: CourseSummary[]
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
  finalGrade?: number
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
