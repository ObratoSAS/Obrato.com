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
  CONSTRAINT CK_Cursos_Creditos CHECK (Creditos = 3)
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
  ('María González', 'mgonzalez@example.edu'),
  ('Andrés Castillo', 'acastillo@example.edu'),
  ('Juliana Mesa', 'jmesa@example.edu');

INSERT INTO Cursos (Codigo, Nombre, Creditos, ProgramaId, ProfesorId) VALUES
  ('SIS101', 'Introducción a la Programación', 3, 1, 1),
  ('SIS120', 'Lógica y Algoritmia', 3, 1, 2),
  ('SIS205', 'Bases de Datos', 3, 1, 3),
  ('SIS240', 'Arquitectura de Computadores', 3, 1, 4),
  ('SIS310', 'Ingeniería de Software', 3, 1, 5),
  ('ADM110', 'Fundamentos de Administración', 3, 2, 3),
  ('ADM150', 'Contabilidad Financiera', 3, 2, 1),
  ('ADM205', 'Marketing Estratégico', 3, 2, 4),
  ('ADM260', 'Gestión del Talento Humano', 3, 2, 5),
  ('ADM315', 'Finanzas Corporativas', 3, 2, 2);

INSERT INTO Estudiantes (Documento, Nombres, Apellidos, ProgramaId) VALUES
  ('1002003001', 'Ana', 'Sarmiento', 1),
  ('1002003002', 'Miguel', 'López', 1),
  ('1002003003', 'Sara', 'García', 1),
  ('2003004001', 'Valeria', 'Ruiz', 2),
  ('2003004002', 'Andrés', 'Morales', 2),
  ('2003004003', 'Camila', 'Castro', 2);

INSERT INTO Inscripciones (EstudianteId, CursoId, NotaFinal) VALUES
  (1, 1, 4.5), (2, 1, NULL), (3, 1, NULL),
  (1, 2, NULL), (2, 2, 4.0), (3, 2, NULL),
  (1, 3, NULL), (2, 3, NULL), (3, 3, 4.2),
  (1, 4, NULL), (2, 4, NULL), (3, 4, NULL),
  (1, 5, NULL), (2, 5, NULL), (3, 5, NULL),
  (4, 6, 4.7), (5, 6, NULL), (6, 6, NULL),
  (4, 7, NULL), (5, 7, 4.1), (6, 7, NULL),
  (4, 8, NULL), (5, 8, NULL), (6, 8, NULL),
  (4, 9, NULL), (5, 9, NULL), (6, 9, 4.3),
  (4, 10, NULL), (5, 10, NULL), (6, 10, NULL);

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
