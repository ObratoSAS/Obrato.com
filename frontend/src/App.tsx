import { useMemo, useState } from 'react'
import { AcademicLayout } from './components/AcademicLayout'
import { EnrollmentPanel } from './components/EnrollmentPanel'
import { ProgramPanel } from './components/ProgramPanel'
import { StudentPanel } from './components/StudentPanel'
import { useAcademicData } from './hooks/useAcademicData'
import './styles/app.css'

function App (): JSX.Element {
  const { programs, courses, students, professors, enrollments, isLoading, refetchAll, invalidate } = useAcademicData()
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

  const selectedStudent = useMemo(() => students.data?.find(student => student.id === selectedStudentId) ?? null, [students.data, selectedStudentId])

  return (
    <AcademicLayout isLoading={isLoading} onRefresh={refetchAll}>
      <section className="grid panels">
        <ProgramPanel programs={programs.data ?? []} professors={professors.data ?? []} onInvalidate={invalidate} />
        <StudentPanel
          students={students.data ?? []}
          programs={programs.data ?? []}
          onSelect={setSelectedStudentId}
          selectedStudentId={selectedStudentId}
          onInvalidate={invalidate}
        />
        <EnrollmentPanel
          student={selectedStudent}
          courses={courses.data ?? []}
          enrollments={enrollments.data ?? []}
          onStudentChange={setSelectedStudentId}
          students={students.data ?? []}
          onInvalidate={invalidate}
        />
      </section>
    </AcademicLayout>
  )
}

export default App
