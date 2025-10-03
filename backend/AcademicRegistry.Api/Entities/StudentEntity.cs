using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcademicRegistry.Api.Entities;

public class StudentEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(20)]
    public string Document { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [ForeignKey(nameof(Program))]
    public int ProgramId { get; set; }

    public ProgramEntity? Program { get; set; }

    public ICollection<EnrollmentEntity> Enrollments { get; set; } = new List<EnrollmentEntity>();
}
