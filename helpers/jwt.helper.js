const jwt = require('jsonwebtoken');



const generarJWT = (id, role) => {

    return new Promise((resolve, reject) => {

        const payload = { id, role };

        jwt.sign(payload, process.env.JWT_SEED, {
            expiresIn: '24h'
        }, (err, token) => {

            if (err) {
                reject('No se pudo generar en JWT');
            } else {
                resolve(token)
            }

        })

    })

}



const comprobarJWT = ( bearerToken = '') => {

    try {
        
        const token = bearerToken.split(' ')[1];
        const {id, role}  = jwt.verify(token, process.env.JWT_SEED)

        return [true, id, role];

    } catch(error){
        return [false, null, null];
    }

}




module.exports = {
    generarJWT,
    comprobarJWT
}