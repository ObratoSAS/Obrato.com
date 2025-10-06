namespace AcademicRegistry.Api.Dtos;

// DTO utilizado para listar profesores.
public record ProfessorDto(int Id, string FullName, string Email);

// Datos requeridos al crear un profesor.
public record ProfessorCreateDto(string FullName, string Email);
