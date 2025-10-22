/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed inicial de Obrato LMS');
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: 'Administrador global' }
  });
  const teacherRole = await prisma.role.upsert({
    where: { name: 'teacher' },
    update: {},
    create: { name: 'teacher', description: 'Profesor' }
  });
  const studentRole = await prisma.role.upsert({
    where: { name: 'student' },
    update: {},
    create: { name: 'student', description: 'Estudiante' }
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@obrato.test' },
    update: {},
    create: {
      email: 'admin@obrato.test',
      fullName: 'Admin Obrato',
      passwordHash: await argon2.hash('Admin123!'),
      language: 'es'
    }
  });

  await prisma.userRole.upsert({
    where: { userId_roleId_courseId: { userId: admin.id, roleId: adminRole.id, courseId: null } },
    update: {},
    create: {
      userId: admin.id,
      roleId: adminRole.id
    }
  });

  const teachers = await Promise.all(
    ['Ada Lovelace', 'Alan Turing'].map((name, index) =>
      prisma.user.upsert({
        where: { email: `teacher${index + 1}@obrato.test` },
        update: {},
        create: {
          email: `teacher${index + 1}@obrato.test`,
          fullName: name,
          passwordHash: await argon2.hash('Teacher123!')
        }
      })
    )
  );

  const students = await Promise.all(
    Array.from({ length: 5 }).map((_, index) =>
      prisma.user.upsert({
        where: { email: `student${index + 1}@obrato.test` },
        update: {},
        create: {
          email: `student${index + 1}@obrato.test`,
          fullName: `Estudiante ${index + 1}`,
          passwordHash: await argon2.hash('Student123!')
        }
      })
    )
  );

  const category = await prisma.courseCategory.upsert({
    where: { id: 'default-category' },
    update: {},
    create: {
      id: 'default-category',
      name: 'Cursos Demo'
    }
  });

  const course = await prisma.course.upsert({
    where: { shortName: 'demo-course' },
    update: {},
    create: {
      shortName: 'demo-course',
      fullName: 'Curso Demo Obrato',
      summary: 'Curso de demostración con actividades de ejemplo',
      category: { connect: { id: category.id } },
      teachers: { connect: teachers.map((teacher) => ({ id: teacher.id })) }
    }
  });

  const section = await prisma.courseSection.upsert({
    where: { id: `${course.id}-welcome` },
    update: {},
    create: {
      id: `${course.id}-welcome`,
      name: 'Bienvenida',
      order: 1,
      course: { connect: { id: course.id } }
    }
  });

  const assignment = await prisma.activity.upsert({
    where: { id: `${course.id}-assignment-inicial` },
    update: {},
    create: {
      id: `${course.id}-assignment-inicial`,
      type: 'assignment',
      title: 'Entrega de tarea inicial',
      description: 'Sube un documento con tus expectativas del curso',
      course: { connect: { id: course.id } },
      section: { connect: { id: section.id } },
      gradingMethod: 'points',
      maxScore: 100
    }
  });

  const forum = await prisma.activity.upsert({
    where: { id: `${course.id}-foro-presentacion` },
    update: {},
    create: {
      id: `${course.id}-foro-presentacion`,
      type: 'forum',
      title: 'Foro de presentación',
      description: 'Comparte quién eres y qué esperas aprender',
      course: { connect: { id: course.id } },
      section: { connect: { id: section.id } }
    }
  });

  await prisma.forum.upsert({
    where: { id: `${course.id}-foro` },
    update: {},
    create: {
      id: `${course.id}-foro`,
      title: 'Foro de presentación',
      type: 'general',
      activity: { connect: { id: forum.id } }
    }
  });

  const gradeItem = await prisma.gradeItem.upsert({
    where: { id: `${course.id}-grade-inicial` },
    update: {},
    create: {
      id: `${course.id}-grade-inicial`,
      course: { connect: { id: course.id } },
      activity: { connect: { id: assignment.id } },
      name: 'Tarea inicial',
      maxScore: 100,
      weight: 1,
      position: 1
    }
  });

  await Promise.all(
    data: {
      type: 'assignment',
      title: 'Entrega de tarea inicial',
      description: 'Sube un documento con tus expectativas del curso',
      course: { connect: { id: course.id } },
      section: { connect: { id: section.id } },
      gradingMethod: 'points',
      maxScore: 100
    }
  });

  const forum = await prisma.activity.create({
    data: {
      type: 'forum',
      title: 'Foro de presentación',
      description: 'Comparte quién eres y qué esperas aprender',
      course: { connect: { id: course.id } },
      section: { connect: { id: section.id } }
    }
  });

  await prisma.forum.create({
    data: {
      title: 'Foro de presentación',
      type: 'general',
      activity: { connect: { id: forum.id } }
    }
  });

  const gradeItem = await prisma.gradeItem.upsert({
    where: { id: assignment.id },
    update: {},
    create: {
      id: assignment.id,
      course: { connect: { id: course.id } },
      activity: { connect: { id: assignment.id } },
      name: 'Tarea inicial',
      maxScore: 100,
      weight: 1,
      position: 1
    }
  });

  await Promise.all(
    students.map((student, index) =>
      prisma.enrollment.upsert({
        where: { userId_courseId: { userId: student.id, courseId: course.id } },
        update: {},
        create: {
          user: { connect: { id: student.id } },
          course: { connect: { id: course.id } }
        }
      }).then(() =>
        prisma.gradeEntry.upsert({
          where: { gradeItemId_userId: { gradeItemId: gradeItem.id, userId: student.id } },
          update: { score: 80 + index, gradedAt: new Date() },
          create: { gradeItemId: gradeItem.id, userId: student.id, score: 80 + index }
        })
      )
  );

  console.log('Seed completado');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
