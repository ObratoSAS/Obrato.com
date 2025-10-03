namespace AcademicRegistry.Api.Dtos;

public record ProfessorDto(int Id, string FullName, string Email);

public record ProfessorCreateDto(string FullName, string Email);
