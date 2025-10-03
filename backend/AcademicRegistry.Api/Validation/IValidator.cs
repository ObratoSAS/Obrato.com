namespace AcademicRegistry.Api.Validation;

public interface IValidator<in T>
{
    ValidationResult Validate(T instance);
}

public record ValidationResult(bool IsValid, IReadOnlyDictionary<string, string[]> Errors)
{
    public static ValidationResult Success() => new(true, new Dictionary<string, string[]>());

    public static ValidationResult Failure(Dictionary<string, List<string>> errors)
        => new(false, errors.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToArray()));
}

public static class ValidationResultExtensions
{
    public static IResult ToProblemDetails(this ValidationResult result)
    {
        return Results.ValidationProblem(result.Errors);
    }
}
