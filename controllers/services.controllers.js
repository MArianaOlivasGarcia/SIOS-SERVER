

const { response } = require('express');
const Service = require('../models/service');
const User = require('../models/user');

const getAllByUserId = async(req, res = response ) => {

    try {
        
        
        const { id } = req.params;
        const doesExist = await User.findById( id );


        if ( !doesExist ) {
            res.status(404).json({
                status: false,
                message: `No existe un usuario con el ID ${id}`
            })
        }

        //TODO: filtrar que no sean los del dia de hoy
        const services = await Service.find({user: id})

        res.status(200).json({
            status: false,
            services
        })


    } catch( error ) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }

}




const getAllByAssignedToId = async(req, res = response ) => {

    try {
        
        const { id } = req.params;

        const doesExist = await User.findById( id );


        if ( !doesExist ) {
            res.status(404).json({
                status: false,
                message: `No existe un usuario con el ID ${id}`
            })
        }

        const services = await Service.find({assignedTo: id})

        res.status(200).json({
            status: false,
            services
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
    getAllByUserId,
    getAllByAssignedToId
}
