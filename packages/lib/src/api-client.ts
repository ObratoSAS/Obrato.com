import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
}

export async function getCourses(params?: { q?: string }) {
  if (params?.q) {
    const response = await api.get('/courses/search', { params: { q: params.q } });
    return response.data;
  }
  const response = await api.get('/courses');
  return response.data;
}

export async function getDashboard() {
  const [courses, notifications] = await Promise.all([
    api.get('/courses'),
    api.get('/notifications')
  ]);
  return { courses: courses.data, notifications: notifications.data };
}

export async function getCourse(courseId: string) {
  const response = await api.get(`/courses/${courseId}`);
  return response.data;
}

export async function getActivity(courseId: string, activityId: string) {
  const course = await getCourse(courseId);
  return course.activities?.find((activity: any) => activity.id === activityId) ?? null;
}
