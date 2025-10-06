using AcademicRegistry.Api.Entities;
using Microsoft.EntityFrameworkCore;

// DbContext central que representa el modelo académico en memoria.

namespace AcademicRegistry.Api.Data;

public class AcademicContext : DbContext
{
    /// <summary>
    /// Constructor que recibe la configuración de EF Core.
    /// </summary>
    public AcademicContext(DbContextOptions<AcademicContext> options) : base(options)
    {
    }

    /// <summary>
    /// Colección de programas académicos.
    /// </summary>
    public DbSet<ProgramEntity> Programs => Set<ProgramEntity>();
    /// <summary>
    /// Colección de materias ofertadas.
    /// </summary>
    public DbSet<CourseEntity> Courses => Set<CourseEntity>();
    /// <summary>
    /// Colección de docentes registrados.
    /// </summary>
    public DbSet<ProfessorEntity> Professors => Set<ProfessorEntity>();
    /// <summary>
    /// Colección de estudiantes activos.
    /// </summary>
    public DbSet<StudentEntity> Students => Set<StudentEntity>();
    /// <summary>
    /// Colección de inscripciones de estudiantes en materias.
    /// </summary>
    public DbSet<EnrollmentEntity> Enrollments => Set<EnrollmentEntity>();
}
