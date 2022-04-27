const { Router } = require('express');
const { check } = require('express-validator');
const { register, login, renewJWT, getListRoles } = require('../controllers/auth.controllers');
const { validarCampos } = require('../middlewares/validar-campos.middleware');
const { validarJWT, validarADMIN_ROLE } = require('../middlewares/validar-jwt.middleware');


const router = Router();


router.post('/login', [
    check('username', 'El username es requerido.').not().isEmpty(),
    check('password', 'El password es requerido.').not().isEmpty(),
    validarCampos
], login);

router.post('/register', [
    check('username', 'El username es requerido.').not().isEmpty(),
    check('name', 'El name es requerido.').not().isEmpty(),
    check('password', 'El password es requerido.').not().isEmpty(),
    validarJWT,
    validarADMIN_ROLE
], register);




router.get('/renew', validarJWT, renewJWT);

router.get('/roles', getListRoles);



module.exports = router;