const { Router } = require('express');
const { getAllByRole, update, getUsersIsActive } = require('../controllers/users.controller');
const { validarADMIN_ROLE, validarJWT } = require('../middlewares/validar-jwt.middleware');

const router = Router();


router.get('/all/active', getUsersIsActive);


router.get('/all/:role', getAllByRole);


router.put('/update/:id', [
    // check('username', 'El username es requerido.').not().isEmpty(),
    // check('name', 'El name es requerido.').not().isEmpty(),
    // check('role', 'El role es requerido.').not().isEmpty(),
    // check('isActive', 'El role es requerido.').not().isEmpty(),
    // validarCampos
    validarJWT,
    validarADMIN_ROLE
], update);


module.exports = router; 