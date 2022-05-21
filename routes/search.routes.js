const { Router } = require('express');
const { searchBitacora } = require('../controllers/search.controllers');

const router = Router();


router.get('/:query', searchBitacora)

module.exports = router;