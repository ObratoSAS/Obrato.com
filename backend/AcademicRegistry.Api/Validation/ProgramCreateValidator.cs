using AcademicRegistry.Api.Data;
using AcademicRegistry.Api.Dtos;

// Valida el alta de programas para evitar duplicados y datos inválidos.

namespace AcademicRegistry.Api.Validation;

public class ProgramCreateValidator : IValidator<ProgramCreateDto>
{
    private readonly AcademicContext _context;

    public ProgramCreateValidator(AcademicContext context)
    {
        _context = context;
    }

    public ValidationResult Validate(ProgramCreateDto instance)
    {
        var errors = new Dictionary<string, List<string>>();

        if (string.IsNullOrWhiteSpace(instance.Name))
        {
            errors.Add("name", new List<string> { "El nombre es obligatorio." });
        }
        else if (_context.Programs.Any(p => p.Name.ToLower() == instance.Name.ToLower()))
        {
            errors.Add("name", new List<string> { "Ya existe un programa con este nombre." });
        }

        if (instance.RequiredCredits <= 0)
        {
            errors.Add("requiredCredits", new List<string> { "Los créditos deben ser mayores a cero." });
        }

        return errors.Count == 0 ? ValidationResult.Success() : ValidationResult.Failure(errors);
    }
}
