const { Router } = require('express');
const { check } = require('express-validator');
const { update, create, getAll, getById, changeIsActive } = require('../controllers/periods.controllers');
const { validarCampos } = require('../middlewares/validar-campos.middleware');
const { validarADMIN_ROLE, validarJWT } = require('../middlewares/validar-jwt.middleware');

const router = Router();


router.get('/all', getAll);

router.post('/create', [
    check('name', 'El name es requerido.').not().isEmpty(),
    check('startDate', 'El startDate es requerido.').not().isEmpty(),
    check('finalDate', 'El finalDate es requerido.').not().isEmpty(),
    validarCampos,
    validarJWT,
    validarADMIN_ROLE
], create);



router.put('/update/:id', [
    validarJWT,
    validarADMIN_ROLE
], update);




router.get('/all',  getAll );


router.get('/isActual/:id',  changeIsActive );


router.get('/:id',  getById );




module.exports = router;