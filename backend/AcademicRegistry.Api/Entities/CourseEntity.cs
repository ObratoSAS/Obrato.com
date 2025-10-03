using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcademicRegistry.Api.Entities;

public class CourseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(12)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Range(1, 20)]
    public int Credits { get; set; }

    [ForeignKey(nameof(Program))]
    public int ProgramId { get; set; }

    public ProgramEntity? Program { get; set; }

    [ForeignKey(nameof(Professor))]
    public int ProfessorId { get; set; }

    public ProfessorEntity? Professor { get; set; }

    public ICollection<EnrollmentEntity> Enrollments { get; set; } = new List<EnrollmentEntity>();
}
