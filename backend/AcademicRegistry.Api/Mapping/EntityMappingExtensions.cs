using AcademicRegistry.Api.Dtos;
using AcademicRegistry.Api.Entities;

namespace AcademicRegistry.Api.Mapping;

public static class EntityMappingExtensions
{
    public static ProgramDto ToDto(this ProgramEntity program)
        => new(program.Id, program.Name, program.Description, program.RequiredCredits,
            program.Courses.Select(c => c.ToSummaryDto()).ToList(), program.Students.Count);

    public static CourseSummaryDto ToSummaryDto(this CourseEntity course)
        => new(course.Id, course.Code, course.Name, course.Credits, course.Professor?.ToDto());

    public static CourseDto ToDto(this CourseEntity course)
        => new(course.Id, course.Code, course.Name, course.Credits,
            new ProgramReferenceDto(course.ProgramId, course.Program?.Name ?? string.Empty),
            course.Professor?.ToDto() ?? throw new InvalidOperationException("Course must have a professor"));

    public static ProfessorDto ToDto(this ProfessorEntity professor)
        => new(professor.Id, professor.FullName, professor.Email);

    public static StudentDto ToDto(this StudentEntity student)
        => new(student.Id, student.Document, student.FirstName, student.LastName,
            new ProgramReferenceDto(student.ProgramId, student.Program?.Name ?? string.Empty),
            student.Enrollments.Select(e => e.ToDto()).ToList());

    public static EnrollmentDto ToDto(this EnrollmentEntity enrollment)
        => new(enrollment.Id,
            new StudentReferenceDto(enrollment.StudentId,
                enrollment.Student is null ? string.Empty : $"{enrollment.Student.FirstName} {enrollment.Student.LastName}",
                enrollment.Student?.Document ?? string.Empty),
            new CourseReferenceDto(enrollment.CourseId, enrollment.Course?.Code ?? string.Empty,
                enrollment.Course?.Name ?? string.Empty),
            enrollment.FinalGrade, enrollment.CreatedAt);

    public static ProgramEntity ToEntity(this ProgramCreateDto dto)
        => new()
        {
            Name = dto.Name,
            Description = dto.Description,
            RequiredCredits = dto.RequiredCredits
        };

    public static CourseEntity ToEntity(this CourseCreateDto dto)
        => new()
        {
            Code = dto.Code,
            Name = dto.Name,
            Credits = dto.Credits,
            ProgramId = dto.ProgramId,
            ProfessorId = dto.ProfessorId
        };

    public static ProfessorEntity ToEntity(this ProfessorCreateDto dto)
        => new()
        {
            FullName = dto.FullName,
            Email = dto.Email
        };

    public static StudentEntity ToEntity(this StudentCreateDto dto)
        => new()
        {
            Document = dto.Document,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            ProgramId = dto.ProgramId
        };

    public static EnrollmentEntity ToEntity(this EnrollmentCreateDto dto)
        => new()
        {
            StudentId = dto.StudentId,
            CourseId = dto.CourseId,
            FinalGrade = dto.FinalGrade
        };
}
