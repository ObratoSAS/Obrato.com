namespace AcademicRegistry.Api.Dtos;

public record StudentDto(int Id, string Document, string FirstName, string LastName, ProgramReferenceDto Program, IReadOnlyCollection<EnrollmentDto> Enrollments);

public record StudentCreateDto(string Document, string FirstName, string LastName, int ProgramId);

public record StudentUpdateDto(string Document, string FirstName, string LastName, int ProgramId);
