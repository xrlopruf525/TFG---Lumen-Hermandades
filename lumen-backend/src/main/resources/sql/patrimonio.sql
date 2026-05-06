-- Seed de categorias genericas para el modulo de Patrimonio
-- Pensado para hermandades de Semana Santa y del Rocio
-- Ejecutar en la base de datos lumen_db

USE lumen_db;

INSERT IGNORE INTO Categoria_Patrimonio (nombre, descripcion, deleted) VALUES
('Pasos y Andas', 'Pasos, andas, tronos y estructuras de procesion', false),
('Imagenes Sagradas', 'Titulares, imagenes de culto y devocionales', false),
('Orfebreria', 'Candelabros, coronas, potencias, jarras y piezas metalicas', false),
('Bordados', 'Telas bordadas, mantos, sayas y respiraderos', false),
('Textiles y Ajuar', 'Tunicas, mantos, frontales, mantillas y ajuar textil', false),
('Insignias y Simbologia', 'Estandartes, banderas, varas, medallas y simpecados', false),
('Cereria y Candeleria', 'Cirios, velas, hachones y elementos de luz', false),
('Documentacion y Archivo', 'Libros, actas, inventarios, planos y fotografias historicas', false),
('Culto y Liturgia', 'Objetos para cultos internos, altar y celebraciones', false),
('Mobiliario y Enseres', 'Muebles, vitrinas, peanas, soportes y utiles diversos', false),
('Exorno Floral y Decoracion', 'Floristeria, jarras, jarrones y elementos de ornamentacion', false),
('Joyas y Donaciones', 'Joyeria, medallas, anillos, ofrendas y piezas donadas', false),
('Carretas y Simpecados', 'Carretas, remolques, simpecados y elementos de peregrinacion', false),
('Montaje y Logistica', 'Andamiaje, herramientas, cableado y material de montaje', false),
('Musica y Formaciones', 'Partituras, instrumentos y material de bandas o coros', false);

-- Si en el futuro quereis cargar mas datos, seguid el mismo formato.
-- Ejemplo:
-- INSERT INTO Patrimonio (...)
-- VALUES (...);
