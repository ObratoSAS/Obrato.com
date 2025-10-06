using AcademicRegistry.Api.Data;
using AcademicRegistry.Api.Dtos;
using AcademicRegistry.Api.Entities;
using AcademicRegistry.Api.Mapping;
using AcademicRegistry.Api.Validation;
using Microsoft.EntityFrameworkCore;

// Configuración del host minimal API de .NET para exponer los recursos del registro académico.
var builder = WebApplication.CreateBuilder(args);

// Registramos el contexto en memoria para simplificar la ejecución de la prueba técnica.
builder.Services.AddDbContext<AcademicContext>(options =>
    options.UseInMemoryDatabase("AcademicRegistry"));

// Servicios auxiliares para documentación y descubrimiento de endpoints.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Registramos validadores personalizados que aplican las reglas de negocio descritas.
builder.Services.AddScoped<IValidator<StudentCreateDto>, StudentCreateValidator>();
builder.Services.AddScoped<IValidator<CourseCreateDto>, CourseCreateValidator>();
builder.Services.AddScoped<IValidator<ProgramCreateDto>, ProgramCreateValidator>();
builder.Services.AddScoped<IValidator<EnrollmentCreateDto>, EnrollmentCreateValidator>();

var app = builder.Build();

// Semilla inicial: crea programas, profesores, materias, estudiantes e inscripciones de ejemplo.
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AcademicContext>();
    DatabaseSeeder.Seed(context);
}

// Swagger sólo se habilita en desarrollo para inspeccionar los contratos HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Endpoint GET: retorna la lista de programas académicos con sus materias y conteo de estudiantes.
app.MapGet("/api/programs", async (AcademicContext context) =>
        await context.Programs
            .Include(p => p.Courses)
            .ThenInclude(c => c.Professor)
            .Include(p => p.Students)
            .Select(p => p.ToDto())
            .ToListAsync())
    .WithName("GetPrograms");

// Endpoint POST: crea un nuevo programa académico validando duplicados y campos obligatorios.
app.MapPost("/api/programs", async (ProgramCreateDto dto, AcademicContext context, IValidator<ProgramCreateDto> validator) =>
    {
        var validation = validator.Validate(dto);
        if (!validation.IsValid)
        {
            return Results.BadRequest(validation.ToProblemDetails());
        }

        var program = dto.ToEntity();
        context.Programs.Add(program);
        await context.SaveChangesAsync();
        return Results.Created($"/api/programs/{program.Id}", program.ToDto());
    })
    .WithName("CreateProgram");

// Endpoint PUT: actualiza datos básicos de un programa existente.
app.MapPut("/api/programs/{id:int}", async (int id, ProgramUpdateDto dto, AcademicContext context) =>
    {
        var program = await context.Programs.Include(p => p.Courses).FirstOrDefaultAsync(p => p.Id == id);
        if (program is null)
        {
            return Results.NotFound();
        }

        program.Name = dto.Name;
        program.Description = dto.Description;
        program.RequiredCredits = dto.RequiredCredits;
        await context.SaveChangesAsync();
        return Results.Ok(program.ToDto());
    })
    .WithName("UpdateProgram");

// Endpoint DELETE: elimina un programa por identificador.
app.MapDelete("/api/programs/{id:int}", async (int id, AcademicContext context) =>
    {
        var program = await context.Programs.FindAsync(id);
        if (program is null)
        {
            return Results.NotFound();
        }

        context.Programs.Remove(program);
        await context.SaveChangesAsync();
        return Results.NoContent();
    })
    .WithName("DeleteProgram");

// Endpoint GET: consulta todas las materias junto con su programa y profesor asociado.
app.MapGet("/api/courses", async (AcademicContext context) =>
        await context.Courses
            .Include(c => c.Program)
            .Include(c => c.Professor)
            .Include(c => c.Enrollments)
            .ThenInclude(e => e.Student)
            .Select(c => c.ToDto())
            .ToListAsync())
    .WithName("GetCourses");

// Endpoint POST: registra una materia respetando la regla de créditos fijos y códigos únicos.
app.MapPost("/api/courses", async (CourseCreateDto dto, AcademicContext context, IValidator<CourseCreateDto> validator) =>
    {
        var validation = validator.Validate(dto);
        if (!validation.IsValid)
        {
            return Results.BadRequest(validation.ToProblemDetails());
        }

        var course = dto.ToEntity();
        context.Courses.Add(course);
        await context.SaveChangesAsync();
        return Results.Created($"/api/courses/{course.Id}", course.ToDto());
    })
    .WithName("CreateCourse");

// Endpoint PUT: permite modificar los campos principales de una materia.
app.MapPut("/api/courses/{id:int}", async (int id, CourseUpdateDto dto, AcademicContext context) =>
    {
        var course = await context.Courses.FindAsync(id);
        if (course is null)
        {
            return Results.NotFound();
        }

        if (dto.Credits != 3)
        {
            return Results.BadRequest(new { message = "Cada materia debe tener exactamente 3 créditos." });
        }

        course.Code = dto.Code;
        course.Name = dto.Name;
        course.Credits = dto.Credits;
        course.ProgramId = dto.ProgramId;
        course.ProfessorId = dto.ProfessorId;
        await context.SaveChangesAsync();
        return Results.Ok(course.ToDto());
    })
    .WithName("UpdateCourse");

// Endpoint DELETE: elimina la materia indicada.
app.MapDelete("/api/courses/{id:int}", async (int id, AcademicContext context) =>
    {
        var course = await context.Courses.FindAsync(id);
        if (course is null)
        {
            return Results.NotFound();
        }

        context.Courses.Remove(course);
        await context.SaveChangesAsync();
        return Results.NoContent();
    })
    .WithName("DeleteCourse");

// Endpoint GET: recupera el catálogo de profesores disponibles.
app.MapGet("/api/professors", async (AcademicContext context) =>
        await context.Professors.Select(p => p.ToDto()).ToListAsync())
    .WithName("GetProfessors");

// Endpoint POST: crea un profesor para asignación futura a materias.
app.MapPost("/api/professors", async (ProfessorCreateDto dto, AcademicContext context) =>
    {
        var professor = dto.ToEntity();
        context.Professors.Add(professor);
        await context.SaveChangesAsync();
        return Results.Created($"/api/professors/{professor.Id}", professor.ToDto());
    })
    .WithName("CreateProfessor");

// Endpoint GET: obtiene estudiantes con su programa y materias inscritas.
app.MapGet("/api/students", async (AcademicContext context) =>
        await context.Students
            .Include(s => s.Program)
            .Include(s => s.Enrollments)
            .ThenInclude(e => e.Course)
            .ThenInclude(c => c.Enrollments)
            .ThenInclude(e => e.Student)
            .Select(s => s.ToDto())
            .ToListAsync())
    .WithName("GetStudents");

// Endpoint POST: registra nuevos estudiantes y valida documentos duplicados.
app.MapPost("/api/students", async (StudentCreateDto dto, AcademicContext context, IValidator<StudentCreateDto> validator) =>
    {
        var validation = validator.Validate(dto);
        if (!validation.IsValid)
        {
            return Results.BadRequest(validation.ToProblemDetails());
        }

        var student = dto.ToEntity();
        context.Students.Add(student);
        await context.SaveChangesAsync();
        return Results.Created($"/api/students/{student.Id}", student.ToDto());
    })
    .WithName("CreateStudent");

// Endpoint PUT: edita los datos personales de un estudiante.
app.MapPut("/api/students/{id:int}", async (int id, StudentUpdateDto dto, AcademicContext context) =>
    {
        var student = await context.Students.FindAsync(id);
        if (student is null)
        {
            return Results.NotFound();
        }

        student.Document = dto.Document;
        student.FirstName = dto.FirstName;
        student.LastName = dto.LastName;
        student.ProgramId = dto.ProgramId;
        await context.SaveChangesAsync();
        return Results.Ok(student.ToDto());
    })
    .WithName("UpdateStudent");

// Endpoint DELETE: elimina un estudiante y sus inscripciones relacionadas.
app.MapDelete("/api/students/{id:int}", async (int id, AcademicContext context) =>
    {
        var student = await context.Students.FindAsync(id);
        if (student is null)
        {
            return Results.NotFound();
        }

        context.Students.Remove(student);
        await context.SaveChangesAsync();
        return Results.NoContent();
    })
    .WithName("DeleteStudent");

// Endpoint GET: devuelve las inscripciones, incluyendo los compañeros de clase asignados.
app.MapGet("/api/enrollments", async (AcademicContext context) =>
        await context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Course)
            .ThenInclude(c => c.Enrollments)
            .ThenInclude(e => e.Student)
            .Select(e => e.ToDto())
            .ToListAsync())
    .WithName("GetEnrollments");

// Endpoint POST: registra la inscripción de un estudiante en una materia.
app.MapPost("/api/enrollments", async (EnrollmentCreateDto dto, AcademicContext context, IValidator<EnrollmentCreateDto> validator) =>
    {
        var validation = validator.Validate(dto);
        if (!validation.IsValid)
        {
            return Results.BadRequest(validation.ToProblemDetails());
        }

        var enrollment = dto.ToEntity();
        context.Enrollments.Add(enrollment);
        await context.SaveChangesAsync();
        return Results.Created($"/api/enrollments/{enrollment.Id}", enrollment.ToDto());
    })
    .WithName("CreateEnrollment");

// Endpoint DELETE: remueve una inscripción existente.
app.MapDelete("/api/enrollments/{id:int}", async (int id, AcademicContext context) =>
    {
        var enrollment = await context.Enrollments.FindAsync(id);
        if (enrollment is null)
        {
            return Results.NotFound();
        }

        context.Enrollments.Remove(enrollment);
        await context.SaveChangesAsync();
        return Results.NoContent();
    })
    .WithName("DeleteEnrollment");

app.Run();
