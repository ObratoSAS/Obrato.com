using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

// Información de docentes encargados de dictar las materias.

namespace AcademicRegistry.Api.Entities;

public class ProfessorEntity
{
    /// <summary>
    /// Identificador único del profesor.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Nombre completo para mostrar en el cliente.
    /// </summary>
    [Required]
    [MaxLength(120)]
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Correo de contacto opcional.
    /// </summary>
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Materias asignadas al profesor.
    /// </summary>
    public ICollection<CourseEntity> Courses { get; set; } = new List<CourseEntity>();
}
