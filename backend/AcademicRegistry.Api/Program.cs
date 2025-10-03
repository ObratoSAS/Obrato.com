using AcademicRegistry.Api.Data;
using AcademicRegistry.Api.Dtos;
using AcademicRegistry.Api.Entities;
using AcademicRegistry.Api.Mapping;
using AcademicRegistry.Api.Validation;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AcademicContext>(options =>
    options.UseInMemoryDatabase("AcademicRegistry"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IValidator<StudentCreateDto>, StudentCreateValidator>();
builder.Services.AddScoped<IValidator<CourseCreateDto>, CourseCreateValidator>();
builder.Services.AddScoped<IValidator<ProgramCreateDto>, ProgramCreateValidator>();
builder.Services.AddScoped<IValidator<EnrollmentCreateDto>, EnrollmentCreateValidator>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AcademicContext>();
    DatabaseSeeder.Seed(context);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/api/programs", async (AcademicContext context) =>
        await context.Programs
            .Include(p => p.Courses)
            .ThenInclude(c => c.Professor)
            .Select(p => p.ToDto())
            .ToListAsync())
    .WithName("GetPrograms");

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

app.MapGet("/api/courses", async (AcademicContext context) =>
        await context.Courses
            .Include(c => c.Program)
            .Include(c => c.Professor)
            .Select(c => c.ToDto())
            .ToListAsync())
    .WithName("GetCourses");

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

app.MapPut("/api/courses/{id:int}", async (int id, CourseUpdateDto dto, AcademicContext context) =>
    {
        var course = await context.Courses.FindAsync(id);
        if (course is null)
        {
            return Results.NotFound();
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

app.MapGet("/api/professors", async (AcademicContext context) =>
        await context.Professors.Select(p => p.ToDto()).ToListAsync())
    .WithName("GetProfessors");

app.MapPost("/api/professors", async (ProfessorCreateDto dto, AcademicContext context) =>
    {
        var professor = dto.ToEntity();
        context.Professors.Add(professor);
        await context.SaveChangesAsync();
        return Results.Created($"/api/professors/{professor.Id}", professor.ToDto());
    })
    .WithName("CreateProfessor");

app.MapGet("/api/students", async (AcademicContext context) =>
        await context.Students
            .Include(s => s.Program)
            .Include(s => s.Enrollments)
            .ThenInclude(e => e.Course)
            .Select(s => s.ToDto())
            .ToListAsync())
    .WithName("GetStudents");

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

app.MapGet("/api/enrollments", async (AcademicContext context) =>
        await context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Course)
            .Select(e => e.ToDto())
            .ToListAsync())
    .WithName("GetEnrollments");

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
