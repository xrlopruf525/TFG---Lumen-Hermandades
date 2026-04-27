const Hermano = require('../models/hermano.model');
const { validateHermanoPayload } = require('../validators/hermano.validator');

const ALLOWED_SORT_FIELDS = [
  'nombre',
  'primer_apellido',
  'segundo_apellido',
  'dni',
  'telefono_movil',
  'email',
  'estado',
  'numeroHermano',
  'createdAt'
];

function toPositiveInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function buildFilters(query) {
  const filters = {};

  if (query.estado) {
    filters.estado = query.estado;
  }

  if (query.search) {
    const searchRegex = new RegExp(String(query.search).trim(), 'i');
    filters.$or = [
      { nombre: searchRegex },
      { primer_apellido: searchRegex },
      { segundo_apellido: searchRegex },
      { dni: searchRegex }
    ];
  }

  return filters;
}

async function listHermanos(req, res, next) {
  try {
    const page = toPositiveInt(req.query.page, 1);
    const pageSize = Math.min(toPositiveInt(req.query.pageSize, 10), 100);
    const sortBy = ALLOWED_SORT_FIELDS.includes(req.query.sortBy)
      ? req.query.sortBy
      : 'primer_apellido';
    const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;

    const filters = buildFilters(req.query);

    const [data, total] = await Promise.all([
      Hermano.find(filters)
        .sort({ [sortBy]: sortDirection, _id: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      Hermano.countDocuments(filters)
    ]);

    const totalPages = Math.max(Math.ceil(total / pageSize), 1);

    res.json({
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getHermanoById(req, res, next) {
  try {
    const hermano = await Hermano.findById(req.params.id);
    if (!hermano) {
      return res.status(404).json({ message: 'Hermano no encontrado' });
    }

    return res.json(hermano);
  } catch (error) {
    return next(error);
  }
}

async function createHermano(req, res, next) {
  try {
    const validation = validateHermanoPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: 'Datos invalidos', errors: validation.errors });
    }

    const created = await Hermano.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
}

async function updateHermano(req, res, next) {
  try {
    const validation = validateHermanoPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: 'Datos invalidos', errors: validation.errors });
    }

    const updated = await Hermano.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Hermano no encontrado' });
    }

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
}

async function deleteHermano(req, res, next) {
  try {
    const deleted = await Hermano.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Hermano no encontrado' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listHermanos,
  getHermanoById,
  createHermano,
  updateHermano,
  deleteHermano
};
