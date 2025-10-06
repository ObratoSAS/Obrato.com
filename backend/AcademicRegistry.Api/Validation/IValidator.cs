namespace AcademicRegistry.Api.Validation;

// Contrato genérico para encapsular validaciones de entrada.
public interface IValidator<in T>
{
    ValidationResult Validate(T instance);
}

// Resultado estándar que permite retornar errores estructurados al cliente.
public record ValidationResult(bool IsValid, IReadOnlyDictionary<string, string[]> Errors)
{
    public static ValidationResult Success() => new(true, new Dictionary<string, string[]>());

    public static ValidationResult Failure(Dictionary<string, List<string>> errors)
        => new(false, errors.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToArray()));
}

public static class ValidationResultExtensions
{
    /// <summary>
    /// Convierte el resultado en un ProblemDetails compatible con Minimal APIs.
    /// </summary>
    public static IResult ToProblemDetails(this ValidationResult result)
    {
        return Results.ValidationProblem(result.Errors);
    }
}
