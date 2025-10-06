using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

// Entidad puente entre estudiantes y materias.

namespace AcademicRegistry.Api.Entities;

public class EnrollmentEntity
{
    /// <summary>
    /// Identificador de la inscripción.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Estudiante que se inscribe a la materia.
    /// </summary>
    [ForeignKey(nameof(Student))]
    public int StudentId { get; set; }

    public StudentEntity? Student { get; set; }

    /// <summary>
    /// Materia asociada a la inscripción.
    /// </summary>
    [ForeignKey(nameof(Course))]
    public int CourseId { get; set; }

    public CourseEntity? Course { get; set; }

    /// <summary>
    /// Nota final opcional entre 0 y 5.
    /// </summary>
    [Range(0, 5)]
    public decimal? FinalGrade { get; set; }

    /// <summary>
    /// Fecha de creación para seguimiento histórico.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
