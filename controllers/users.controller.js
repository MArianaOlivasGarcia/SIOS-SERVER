


const { response } = require('express');
const User = require('../models/user');





const getAllByRole = async(req, res = response ) => {

    const page = Number(req.query.page) || 1;

    const { role } = req.params;

    try {


        const rolesValidos = ['ADMIN_ROLE', 'USER_ROLE', 'SITE_ROLE'];

        if( rolesValidos.indexOf( role.toUpperCase() ) < 0 ){

            return res.status(400).json({
                status: false,
                message: `El role ${ role } no es válido, los roles permitidos son ${rolesValidos.join(', ')}`
            })
    
        }

        const [users, totalResults] = await Promise.all([
            User.find({ role: role.toUpperCase() }).skip(page-1).limit(20),            
            User.countDocuments({ role: role.toUpperCase() })
        ]);


        res.status(200).json({
            status: true,
            users,
            totalResults
        })


    } catch( error ) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }

}





const update = async(req, res = response ) => {

    const { id } = req.params

    try {

        const doesExist = await User.findById( id );

        if ( !doesExist) {
            return res.status(400).json({
                status: false,
                message: `No existe un usuario con el ID ${ id }.`
            })
        }


        const user = await User.findByIdAndUpdate( id, req.body, { new: true })

        res.status(201).json({
            message: `Usuario editado con éxito`,
            status: true,
            user
        })


    } catch( error ) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }

}


module.exports = {
    getAllByRole,
    update,
}
