-- Añade soporte opcional de imagen para patrimonio.
-- Guarda la imagen como texto (data URL o URL remota) para no depender de un endpoint de subida.

ALTER TABLE Patrimonio
  ADD COLUMN imagen_url LONGTEXT NULL AFTER valor_estimado;