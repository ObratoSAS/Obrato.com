namespace AcademicRegistry.Api.Dtos;

public record ProgramDto(int Id, string Name, string Description, int RequiredCredits, IReadOnlyCollection<CourseSummaryDto> Courses, int StudentCount);

public record ProgramCreateDto(string Name, string Description, int RequiredCredits);

public record ProgramUpdateDto(string Name, string Description, int RequiredCredits);

public record CourseSummaryDto(int Id, string Code, string Name, int Credits, ProfessorDto? Professor);
