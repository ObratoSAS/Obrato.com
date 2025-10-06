using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

// Representa los programas académicos disponibles para inscripción.

namespace AcademicRegistry.Api.Entities;

public class ProgramEntity
{
    /// <summary>
    /// Identificador único del programa.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Nombre descriptivo del programa.
    /// </summary>
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Resumen del objetivo académico.
    /// </summary>
    [MaxLength(1024)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Créditos necesarios para culminar el programa.
    /// </summary>
    [Range(1, 300)]
    public int RequiredCredits { get; set; }

    /// <summary>
    /// Materias asociadas al plan de estudios.
    /// </summary>
    public ICollection<CourseEntity> Courses { get; set; } = new List<CourseEntity>();
    /// <summary>
    /// Estudiantes inscritos actualmente.
    /// </summary>
    public ICollection<StudentEntity> Students { get; set; } = new List<StudentEntity>();
}
