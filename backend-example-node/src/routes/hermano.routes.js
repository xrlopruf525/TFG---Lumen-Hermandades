const express = require('express');

const {
  listHermanos,
  getHermanoById,
  createHermano,
  updateHermano,
  deleteHermano
} = require('../controllers/hermano.controller');

const router = express.Router();

router.get('/', listHermanos);
router.get('/:id', getHermanoById);
router.post('/', createHermano);
router.put('/:id', updateHermano);
router.delete('/:id', deleteHermano);

module.exports = router;
