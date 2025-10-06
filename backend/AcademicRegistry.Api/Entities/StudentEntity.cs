using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

// Entidad que modela a los estudiantes registrados en la plataforma.

namespace AcademicRegistry.Api.Entities;

public class StudentEntity
{
    /// <summary>
    /// Identificador autoincremental del estudiante.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Documento de identidad único.
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Document { get; set; } = string.Empty;

    /// <summary>
    /// Nombres del estudiante.
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Apellidos del estudiante.
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Relación con el programa académico al que pertenece.
    /// </summary>
    [ForeignKey(nameof(Program))]
    public int ProgramId { get; set; }

    /// <summary>
    /// Navegación al programa cargado por EF Core.
    /// </summary>
    public ProgramEntity? Program { get; set; }

    /// <summary>
    /// Inscripciones del estudiante a materias específicas.
    /// </summary>
    public ICollection<EnrollmentEntity> Enrollments { get; set; } = new List<EnrollmentEntity>();
}
