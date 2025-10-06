namespace AcademicRegistry.Api.Dtos;

// DTO detallado de materia.
public record CourseDto(int Id, string Code, string Name, int Credits, ProgramReferenceDto Program, ProfessorDto Professor);

// Cuerpo esperado para crear materias desde el cliente.
public record CourseCreateDto(string Code, string Name, int Credits, int ProgramId, int ProfessorId);

// Cuerpo esperado para actualizar materias existentes.
public record CourseUpdateDto(string Code, string Name, int Credits, int ProgramId, int ProfessorId);

// Referencia ligera a un programa.
public record ProgramReferenceDto(int Id, string Name);
