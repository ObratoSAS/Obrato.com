namespace AcademicRegistry.Api.Dtos;

// DTO que representa a detalle los programas académicos.
public record ProgramDto(int Id, string Name, string Description, int RequiredCredits, IReadOnlyCollection<CourseSummaryDto> Courses, int StudentCount);

// Estructura recibida al crear programas.
public record ProgramCreateDto(string Name, string Description, int RequiredCredits);

// Estructura para actualizaciones.
public record ProgramUpdateDto(string Name, string Description, int RequiredCredits);

// Resumen de materia usado dentro de los programas.
public record CourseSummaryDto(int Id, string Code, string Name, int Credits, ProfessorDto? Professor);
