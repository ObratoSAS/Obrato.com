using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcademicRegistry.Api.Entities;

public class EnrollmentEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [ForeignKey(nameof(Student))]
    public int StudentId { get; set; }

    public StudentEntity? Student { get; set; }

    [ForeignKey(nameof(Course))]
    public int CourseId { get; set; }

    public CourseEntity? Course { get; set; }

    [Range(0, 5)]
    public decimal? FinalGrade { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
