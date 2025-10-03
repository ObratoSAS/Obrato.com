namespace AcademicRegistry.Api.Dtos;

public record EnrollmentDto(int Id, StudentReferenceDto Student, CourseReferenceDto Course, decimal? FinalGrade, DateTime CreatedAt);

public record EnrollmentCreateDto(int StudentId, int CourseId, decimal? FinalGrade);

public record StudentReferenceDto(int Id, string FullName, string Document);

public record CourseReferenceDto(int Id, string Code, string Name);
