const { Router } = require('express');
const { getAllByUserId, getAllByAssignedToId, getAllByStatus, getById } = require('../controllers/services.controllers');
const { validarJWT, validarADMIN_ROLE } = require('../middlewares/validar-jwt.middleware');

const router = Router();




router.get('/:id', [ validarJWT ], getById);

router.get('/history/depto/:id', getAllByUserId);

router.get('/history/site/:id', getAllByAssignedToId);

router.get('/all/:status', [
    validarJWT,
    validarADMIN_ROLE
], getAllByStatus);





module.exports = router;