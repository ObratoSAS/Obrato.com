import { useQueries, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import { Course, Enrollment, Professor, Program, Student } from '../types'

interface AcademicResponse<T> {
  data?: T
  isLoading: boolean
  refetch: () => Promise<unknown>
}

export function useAcademicData () {
  const queryClient = useQueryClient()

  const queries = useQueries({
    queries: [
      {
        queryKey: ['programs'],
        queryFn: async (): Promise<Program[]> => (await api.get<Program[]>('/programs')).data
      },
      {
        queryKey: ['courses'],
        queryFn: async (): Promise<Course[]> => (await api.get<Course[]>('/courses')).data
      },
      {
        queryKey: ['students'],
        queryFn: async (): Promise<Student[]> => (await api.get<Student[]>('/students')).data
      },
      {
        queryKey: ['professors'],
        queryFn: async (): Promise<Professor[]> => (await api.get<Professor[]>('/professors')).data
      },
      {
        queryKey: ['enrollments'],
        queryFn: async (): Promise<Enrollment[]> => (await api.get<Enrollment[]>('/enrollments')).data
      }
    ]
  })

  const refetchAll = async () => {
    await Promise.all(queries.map(async query => await query.refetch()))
  }

  return {
    programs: queries[0] as AcademicResponse<Program[]>,
    courses: queries[1] as AcademicResponse<Course[]>,
    students: queries[2] as AcademicResponse<Student[]>,
    professors: queries[3] as AcademicResponse<Professor[]>,
    enrollments: queries[4] as AcademicResponse<Enrollment[]>,
    isLoading: queries.some(query => query.isLoading),
    refetchAll,
    invalidate: async (key: string[]) => await queryClient.invalidateQueries({ queryKey: key })
  }
}
