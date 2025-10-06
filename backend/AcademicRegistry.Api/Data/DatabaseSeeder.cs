using AcademicRegistry.Api.Entities;

namespace AcademicRegistry.Api.Data;

public static class DatabaseSeeder
{
    /// <summary>
    /// Inicializa la base en memoria con información coherente con los requerimientos del reto.
    /// </summary>
    public static void Seed(AcademicContext context)
    {
        if (context.Programs.Any())
        {
            return;
        }

        // Programas base de ejemplo.
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

        // Plantilla de profesores para las diez materias exigidas.
        var professors = new List<ProfessorEntity>
        {
            new() { FullName = "Laura Pérez", Email = "lperez@example.edu" },
            new() { FullName = "Carlos Rodríguez", Email = "crodriguez@example.edu" },
            new() { FullName = "María González", Email = "mgonzalez@example.edu" },
            new() { FullName = "Andrés Castillo", Email = "acastillo@example.edu" },
            new() { FullName = "Juliana Mesa", Email = "jmesa@example.edu" }
        };

        context.Programs.AddRange(programs);
        context.Professors.AddRange(professors);
        context.SaveChanges();

        // Las diez materias se crean con 3 créditos fijos, cumpliendo la regla del enunciado.
        var courses = new List<CourseEntity>
        {
            new() { Code = "SIS101", Name = "Introducción a la Programación", Credits = 3, ProgramId = programs[0].Id, ProfessorId = professors[0].Id },
            new() { Code = "SIS120", Name = "Lógica y Algoritmia", Credits = 3, ProgramId = programs[0].Id, ProfessorId = professors[1].Id },
            new() { Code = "SIS205", Name = "Bases de Datos", Credits = 3, ProgramId = programs[0].Id, ProfessorId = professors[2].Id },
            new() { Code = "SIS240", Name = "Arquitectura de Computadores", Credits = 3, ProgramId = programs[0].Id, ProfessorId = professors[3].Id },
            new() { Code = "SIS310", Name = "Ingeniería de Software", Credits = 3, ProgramId = programs[0].Id, ProfessorId = professors[4].Id },
            new() { Code = "ADM110", Name = "Fundamentos de Administración", Credits = 3, ProgramId = programs[1].Id, ProfessorId = professors[2].Id },
            new() { Code = "ADM150", Name = "Contabilidad Financiera", Credits = 3, ProgramId = programs[1].Id, ProfessorId = professors[0].Id },
            new() { Code = "ADM205", Name = "Marketing Estratégico", Credits = 3, ProgramId = programs[1].Id, ProfessorId = professors[3].Id },
            new() { Code = "ADM260", Name = "Gestión del Talento Humano", Credits = 3, ProgramId = programs[1].Id, ProfessorId = professors[4].Id },
            new() { Code = "ADM315", Name = "Finanzas Corporativas", Credits = 3, ProgramId = programs[1].Id, ProfessorId = professors[1].Id }
        };

        context.Courses.AddRange(courses);
        context.SaveChanges();

        // Estudiantes distribuidos entre los dos programas para poblar las inscripciones.
        var students = new List<StudentEntity>
        {
            new() { Document = "1002003001", FirstName = "Ana", LastName = "Sarmiento", ProgramId = programs[0].Id },
            new() { Document = "1002003002", FirstName = "Miguel", LastName = "López", ProgramId = programs[0].Id },
            new() { Document = "1002003003", FirstName = "Sara", LastName = "García", ProgramId = programs[0].Id },
            new() { Document = "2003004001", FirstName = "Valeria", LastName = "Ruiz", ProgramId = programs[1].Id },
            new() { Document = "2003004002", FirstName = "Andrés", LastName = "Morales", ProgramId = programs[1].Id },
            new() { Document = "2003004003", FirstName = "Camila", LastName = "Castro", ProgramId = programs[1].Id }
        };

        context.Students.AddRange(students);
        context.SaveChanges();

        // Inscripciones: cada curso cuenta con al menos tres estudiantes para habilitar la vista de compañeros.
        var enrollments = new List<EnrollmentEntity>
        {
            new() { StudentId = students[0].Id, CourseId = courses[0].Id, FinalGrade = 4.5m },
            new() { StudentId = students[1].Id, CourseId = courses[0].Id },
            new() { StudentId = students[2].Id, CourseId = courses[0].Id },
            new() { StudentId = students[0].Id, CourseId = courses[1].Id },
            new() { StudentId = students[1].Id, CourseId = courses[1].Id, FinalGrade = 4.0m },
            new() { StudentId = students[2].Id, CourseId = courses[1].Id },
            new() { StudentId = students[0].Id, CourseId = courses[2].Id },
            new() { StudentId = students[1].Id, CourseId = courses[2].Id },
            new() { StudentId = students[2].Id, CourseId = courses[2].Id, FinalGrade = 4.2m },
            new() { StudentId = students[0].Id, CourseId = courses[3].Id },
            new() { StudentId = students[1].Id, CourseId = courses[3].Id },
            new() { StudentId = students[2].Id, CourseId = courses[3].Id },
            new() { StudentId = students[0].Id, CourseId = courses[4].Id },
            new() { StudentId = students[1].Id, CourseId = courses[4].Id },
            new() { StudentId = students[2].Id, CourseId = courses[4].Id },
            new() { StudentId = students[3].Id, CourseId = courses[5].Id, FinalGrade = 4.7m },
            new() { StudentId = students[4].Id, CourseId = courses[5].Id },
            new() { StudentId = students[5].Id, CourseId = courses[5].Id },
            new() { StudentId = students[3].Id, CourseId = courses[6].Id },
            new() { StudentId = students[4].Id, CourseId = courses[6].Id, FinalGrade = 4.1m },
            new() { StudentId = students[5].Id, CourseId = courses[6].Id },
            new() { StudentId = students[3].Id, CourseId = courses[7].Id },
            new() { StudentId = students[4].Id, CourseId = courses[7].Id },
            new() { StudentId = students[5].Id, CourseId = courses[7].Id },
            new() { StudentId = students[3].Id, CourseId = courses[8].Id },
            new() { StudentId = students[4].Id, CourseId = courses[8].Id },
            new() { StudentId = students[5].Id, CourseId = courses[8].Id, FinalGrade = 4.3m },
            new() { StudentId = students[3].Id, CourseId = courses[9].Id },
            new() { StudentId = students[4].Id, CourseId = courses[9].Id },
            new() { StudentId = students[5].Id, CourseId = courses[9].Id }
        };

        context.Enrollments.AddRange(enrollments);
        context.SaveChanges();
    }
}
