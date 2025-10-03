namespace AcademicRegistry.Api.Dtos;

public record CourseDto(int Id, string Code, string Name, int Credits, ProgramReferenceDto Program, ProfessorDto Professor);

public record CourseCreateDto(string Code, string Name, int Credits, int ProgramId, int ProfessorId);

public record CourseUpdateDto(string Code, string Name, int Credits, int ProgramId, int ProfessorId);

public record ProgramReferenceDto(int Id, string Name);
