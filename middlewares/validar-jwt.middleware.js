const jwt = require('jsonwebtoken');
const User = require('../models/user')

const validarJWT = (req, res, next) => {

    if (!req.headers['authorization']) {
        return res.status(401).json({
            status: false,
            message: 'No hay accessToken en la petición.'
        })
    }

    try {
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];

        const { id, role } = jwt.verify(token, process.env.JWT_SEED)

        req.id = id;
        req.role = role;

        next();

    } catch (error) {
        return res.status(401).json({
            status: false,
            message: 'accessToken no válido.'
        })
    }



}



const validarADMIN_ROLE = async(req, res, next) => {

    const id = req.id;

    try {

        const user = await User.findById( id );

        if ( !user ) {
            return res.status(404).json({
                status: false,
                message: `El usuario con el id ${ id } no existe`
            })
        }
        
        if ( user.role !== 'ADMIN_ROLE' ) {
            return res.status(403).json({
                status: false,
                message: 'No tiene privilegios para hacer esta operación'
            })
        }


        next()

    } catch( error ) {
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }

}



module.exports = {
    validarJWT,
    validarADMIN_ROLE
}