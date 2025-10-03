using AcademicRegistry.Api.Data;
using AcademicRegistry.Api.Dtos;

namespace AcademicRegistry.Api.Validation;

public class CourseCreateValidator : IValidator<CourseCreateDto>
{
    private readonly AcademicContext _context;

    public CourseCreateValidator(AcademicContext context)
    {
        _context = context;
    }

    public ValidationResult Validate(CourseCreateDto instance)
    {
        var errors = new Dictionary<string, List<string>>();

        if (string.IsNullOrWhiteSpace(instance.Code))
        {
            errors.Add("code", new List<string> { "El código es obligatorio." });
        }
        else if (_context.Courses.Any(c => c.Code.ToLower() == instance.Code.ToLower()))
        {
            errors.Add("code", new List<string> { "Ya existe una materia con este código." });
        }

        if (instance.Credits <= 0)
        {
            errors.Add("credits", new List<string> { "Los créditos deben ser mayores a cero." });
        }

        if (!_context.Programs.Any(p => p.Id == instance.ProgramId))
        {
            errors.Add("programId", new List<string> { "El programa asociado no existe." });
        }

        if (!_context.Professors.Any(p => p.Id == instance.ProfessorId))
        {
            errors.Add("professorId", new List<string> { "El profesor asociado no existe." });
        }

        return errors.Count == 0 ? ValidationResult.Success() : ValidationResult.Failure(errors);
    }
}
