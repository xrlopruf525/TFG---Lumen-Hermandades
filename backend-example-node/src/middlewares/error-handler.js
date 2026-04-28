function errorHandler(err, _req, res, _next) {
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Identificador invalido' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Conflicto de datos unicos (por ejemplo, DNI duplicado)' });
  }

  console.error(err);
  return res.status(500).json({ message: 'Error interno del servidor' });
}

module.exports = {
  errorHandler
};
