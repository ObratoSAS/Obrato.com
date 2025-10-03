using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcademicRegistry.Api.Entities;

public class ProgramEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1024)]
    public string Description { get; set; } = string.Empty;

    [Range(1, 300)]
    public int RequiredCredits { get; set; }

    public ICollection<CourseEntity> Courses { get; set; } = new List<CourseEntity>();
    public ICollection<StudentEntity> Students { get; set; } = new List<StudentEntity>();
}
