using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

// Modelo que describe las materias disponibles para inscripción.

namespace AcademicRegistry.Api.Entities;

public class CourseEntity
{
    /// <summary>
    /// Clave primaria autogenerada.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Código corto para identificar la materia.
    /// </summary>
    [Required]
    [MaxLength(12)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Nombre completo de la materia.
    /// </summary>
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Créditos académicos fijos (según requisitos del reto).
    /// </summary>
    [Range(3, 3, ErrorMessage = "Cada materia debe tener exactamente 3 créditos.")]
    public int Credits { get; set; }

    /// <summary>
    /// Referencia al programa al que pertenece la materia.
    /// </summary>
    [ForeignKey(nameof(Program))]
    public int ProgramId { get; set; }

    public ProgramEntity? Program { get; set; }

    /// <summary>
    /// Relación con el profesor asignado.
    /// </summary>
    [ForeignKey(nameof(Professor))]
    public int ProfessorId { get; set; }

    public ProfessorEntity? Professor { get; set; }

    /// <summary>
    /// Estudiantes inscritos en la materia.
    /// </summary>
    public ICollection<EnrollmentEntity> Enrollments { get; set; } = new List<EnrollmentEntity>();
}
