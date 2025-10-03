-- Script de referencia para la plataforma de registro académico (.NET + React)
-- Motor de base de datos sugerido: SQL Server 2022 o MySQL 8+

CREATE TABLE Programas (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(150) NOT NULL,
  Descripcion VARCHAR(1000) NULL,
  CreditosRequeridos INT NOT NULL,
  CONSTRAINT CK_Programas_Creditos CHECK (CreditosRequeridos > 0)
);

CREATE TABLE Profesores (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  NombreCompleto VARCHAR(150) NOT NULL,
  Correo VARCHAR(150) NULL
);

CREATE TABLE Estudiantes (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Documento VARCHAR(20) NOT NULL UNIQUE,
  Nombres VARCHAR(100) NOT NULL,
  Apellidos VARCHAR(100) NOT NULL,
  ProgramaId INT NOT NULL,
  CreadoEn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ProgramaId) REFERENCES Programas(Id)
);

CREATE TABLE Cursos (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Codigo VARCHAR(20) NOT NULL UNIQUE,
  Nombre VARCHAR(150) NOT NULL,
  Creditos INT NOT NULL,
  ProgramaId INT NOT NULL,
  ProfesorId INT NOT NULL,
  FOREIGN KEY (ProgramaId) REFERENCES Programas(Id),
  FOREIGN KEY (ProfesorId) REFERENCES Profesores(Id),
  CONSTRAINT CK_Cursos_Creditos CHECK (Creditos > 0)
);

CREATE TABLE Inscripciones (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  EstudianteId INT NOT NULL,
  CursoId INT NOT NULL,
  NotaFinal DECIMAL(3, 1) NULL,
  CreadoEn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (EstudianteId) REFERENCES Estudiantes(Id) ON DELETE CASCADE,
  FOREIGN KEY (CursoId) REFERENCES Cursos(Id),
  CONSTRAINT UQ_Inscripciones UNIQUE (EstudianteId, CursoId),
  CONSTRAINT CK_Inscripciones_Nota CHECK (NotaFinal BETWEEN 0 AND 5)
);

INSERT INTO Programas (Nombre, Descripcion, CreditosRequeridos) VALUES
  ('Ingeniería de Sistemas', 'Programa orientado al desarrollo de software y gestión tecnológica.', 160),
  ('Administración de Empresas', 'Formación en estrategia, finanzas y liderazgo.', 140);

INSERT INTO Profesores (NombreCompleto, Correo) VALUES
  ('Laura Pérez', 'lperez@example.edu'),
  ('Carlos Rodríguez', 'crodriguez@example.edu'),
  ('María González', 'mgonzalez@example.edu');

INSERT INTO Cursos (Codigo, Nombre, Creditos, ProgramaId, ProfesorId) VALUES
  ('SIS101', 'Introducción a la Programación', 4, 1, 1),
  ('SIS205', 'Bases de Datos', 3, 1, 2),
  ('ADM110', 'Fundamentos de Administración', 3, 2, 3);

INSERT INTO Estudiantes (Documento, Nombres, Apellidos, ProgramaId) VALUES
  ('1002003001', 'Ana', 'Sarmiento', 1),
  ('1002003002', 'Miguel', 'López', 2);

INSERT INTO Inscripciones (EstudianteId, CursoId, NotaFinal) VALUES
  (1, 1, 4.5),
  (1, 2, NULL),
  (2, 3, 4.0);

CREATE VIEW vw_resumen_estudiantes AS
SELECT
  e.Id AS EstudianteId,
  e.Documento,
  CONCAT(e.Nombres, ' ', e.Apellidos) AS NombreCompleto,
  p.Nombre AS Programa,
  p.CreditosRequeridos,
  COUNT(i.Id) AS MateriasInscritas,
  COALESCE(SUM(c.Creditos), 0) AS CreditosInscritos,
  MIN(i.CreadoEn) AS PrimeraInscripcion
FROM Estudiantes e
JOIN Programas p ON p.Id = e.ProgramaId
LEFT JOIN Inscripciones i ON i.EstudianteId = e.Id
LEFT JOIN Cursos c ON c.Id = i.CursoId
GROUP BY e.Id, e.Documento, e.Nombres, e.Apellidos, p.Nombre, p.CreditosRequeridos;
