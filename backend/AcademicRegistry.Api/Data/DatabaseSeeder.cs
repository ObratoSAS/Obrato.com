using AcademicRegistry.Api.Entities;

namespace AcademicRegistry.Api.Data;

public static class DatabaseSeeder
{
    public static void Seed(AcademicContext context)
    {
        if (context.Programs.Any())
        {
            return;
        }

        var programs = new List<ProgramEntity>
        {
            new()
            {
                Name = "Ingeniería de Sistemas",
                Description = "Programa orientado al desarrollo de software y gestión de infraestructura tecnológica.",
                RequiredCredits = 160
            },
            new()
            {
                Name = "Administración de Empresas",
                Description = "Plan de estudios enfocado en estrategia, finanzas y liderazgo organizacional.",
                RequiredCredits = 140
            }
        };

        var professors = new List<ProfessorEntity>
        {
            new()
            {
                FullName = "Laura Pérez",
                Email = "lperez@example.edu"
            },
            new()
            {
                FullName = "Carlos Rodríguez",
                Email = "crodriguez@example.edu"
            },
            new()
            {
                FullName = "María González",
                Email = "mgonzalez@example.edu"
            }
        };

        context.Programs.AddRange(programs);
        context.Professors.AddRange(professors);
        context.SaveChanges();

        var courses = new List<CourseEntity>
        {
            new()
            {
                Code = "SIS101",
                Name = "Introducción a la Programación",
                Credits = 4,
                ProgramId = programs[0].Id,
                ProfessorId = professors[0].Id
            },
            new()
            {
                Code = "SIS205",
                Name = "Bases de Datos",
                Credits = 3,
                ProgramId = programs[0].Id,
                ProfessorId = professors[1].Id
            },
            new()
            {
                Code = "ADM110",
                Name = "Fundamentos de Administración",
                Credits = 3,
                ProgramId = programs[1].Id,
                ProfessorId = professors[2].Id
            }
        };

        context.Courses.AddRange(courses);
        context.SaveChanges();

        var students = new List<StudentEntity>
        {
            new()
            {
                Document = "1002003001",
                FirstName = "Ana",
                LastName = "Sarmiento",
                ProgramId = programs[0].Id
            },
            new()
            {
                Document = "1002003002",
                FirstName = "Miguel",
                LastName = "López",
                ProgramId = programs[1].Id
            }
        };

        context.Students.AddRange(students);
        context.SaveChanges();

        var enrollments = new List<EnrollmentEntity>
        {
            new()
            {
                StudentId = students[0].Id,
                CourseId = courses[0].Id,
                FinalGrade = 4.5m
            },
            new()
            {
                StudentId = students[0].Id,
                CourseId = courses[1].Id
            },
            new()
            {
                StudentId = students[1].Id,
                CourseId = courses[2].Id,
                FinalGrade = 4.0m
            }
        };

        context.Enrollments.AddRange(enrollments);
        context.SaveChanges();
    }
}
