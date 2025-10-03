using AcademicRegistry.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace AcademicRegistry.Api.Data;

public class AcademicContext : DbContext
{
    public AcademicContext(DbContextOptions<AcademicContext> options) : base(options)
    {
    }

    public DbSet<ProgramEntity> Programs => Set<ProgramEntity>();
    public DbSet<CourseEntity> Courses => Set<CourseEntity>();
    public DbSet<ProfessorEntity> Professors => Set<ProfessorEntity>();
    public DbSet<StudentEntity> Students => Set<StudentEntity>();
    public DbSet<EnrollmentEntity> Enrollments => Set<EnrollmentEntity>();
}
