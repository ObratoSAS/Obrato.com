namespace AcademicRegistry.Api.Dtos;

// DTO que expone la inscripción junto con compañeros visibles para el estudiante.
public record EnrollmentDto(int Id, StudentReferenceDto Student, CourseReferenceDto Course, decimal? FinalGrade, IReadOnlyList<string> Classmates, DateTime CreatedAt);

// Cuerpo esperado para crear una nueva inscripción.
public record EnrollmentCreateDto(int StudentId, int CourseId, decimal? FinalGrade);

// Referencias ligeras que reutiliza la aplicación cliente.
public record StudentReferenceDto(int Id, string FullName, string Document);

public record CourseReferenceDto(int Id, string Code, string Name);
