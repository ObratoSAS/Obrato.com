using AcademicRegistry.Api.Data;
using AcademicRegistry.Api.Dtos;

namespace AcademicRegistry.Api.Validation;

public class StudentCreateValidator : IValidator<StudentCreateDto>
{
    private readonly AcademicContext _context;

    public StudentCreateValidator(AcademicContext context)
    {
        _context = context;
    }

    public ValidationResult Validate(StudentCreateDto instance)
    {
        var errors = new Dictionary<string, List<string>>();

        if (string.IsNullOrWhiteSpace(instance.Document))
        {
            errors.Add("document", new List<string> { "El documento es obligatorio." });
        }
        else if (_context.Students.Any(s => s.Document == instance.Document))
        {
            errors.Add("document", new List<string> { "Ya existe un estudiante con este documento." });
        }

        if (!_context.Programs.Any(p => p.Id == instance.ProgramId))
        {
            errors.Add("programId", new List<string> { "El programa no existe." });
        }

        return errors.Count == 0 ? ValidationResult.Success() : ValidationResult.Failure(errors);
    }
}
