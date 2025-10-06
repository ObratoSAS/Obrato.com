namespace AcademicRegistry.Api.Dtos;

// DTO de lectura para estudiantes.
public record StudentDto(int Id, string Document, string FirstName, string LastName, ProgramReferenceDto Program, IReadOnlyCollection<EnrollmentDto> Enrollments);

// Cuerpo de creación.
public record StudentCreateDto(string Document, string FirstName, string LastName, int ProgramId);

// Cuerpo de actualización.
public record StudentUpdateDto(string Document, string FirstName, string LastName, int ProgramId);
