using AcademicRegistry.Api.Data;
using AcademicRegistry.Api.Dtos;

namespace AcademicRegistry.Api.Validation;

public class EnrollmentCreateValidator : IValidator<EnrollmentCreateDto>
{
    private readonly AcademicContext _context;

    public EnrollmentCreateValidator(AcademicContext context)
    {
        _context = context;
    }

    public ValidationResult Validate(EnrollmentCreateDto instance)
    {
        var errors = new Dictionary<string, List<string>>();

        if (!_context.Students.Any(s => s.Id == instance.StudentId))
        {
            errors.Add("studentId", new List<string> { "El estudiante no existe." });
        }

        var course = _context.Courses.FirstOrDefault(c => c.Id == instance.CourseId);
        if (course is null)
        {
            errors.Add("courseId", new List<string> { "La materia no existe." });
        }
        else
        {
            var existingCredits = _context.Enrollments
                .Where(e => e.StudentId == instance.StudentId)
                .Join(_context.Courses, e => e.CourseId, c => c.Id, (e, c) => c.Credits)
                .Sum();

            var student = _context.Students.FirstOrDefault(s => s.Id == instance.StudentId);
            if (student is not null)
            {
                var program = _context.Programs.FirstOrDefault(p => p.Id == student.ProgramId);
                if (program is not null && existingCredits + course.Credits > program.RequiredCredits)
                {
                    errors.Add("credits", new List<string> { "La inscripción excede los créditos del plan." });
                }
            }

            if (_context.Enrollments.Any(e => e.StudentId == instance.StudentId && e.CourseId == instance.CourseId))
            {
                errors.Add("courseId", new List<string> { "El estudiante ya está inscrito en esta materia." });
            }
        }

        if (instance.FinalGrade is not null && (instance.FinalGrade < 0 || instance.FinalGrade > 5))
        {
            errors.Add("finalGrade", new List<string> { "La nota debe estar entre 0 y 5." });
        }

        return errors.Count == 0 ? ValidationResult.Success() : ValidationResult.Failure(errors);
    }
}
