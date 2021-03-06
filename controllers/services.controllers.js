

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
        const services = await Service.find({user: id}, '-user').populate('report').populate('assignedTo')

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


const getById = async(req, res = response ) => {

    try {
        
        
        const { id } = req.params; 
        const service = await Service.findById( id )
                .populate('report')
                .populate('assignedTo')
                .populate('user')


        if ( !service ) {
            res.status(404).json({
                status: false,
                message: `No existe un servicio con el ID ${id}`
            })
        }

        res.status(200).json({
            status: false,
            service
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

        const services = await Service.find({assignedTo: id}, '-user')
        .populate('report').populate('assignedTo').populate({
            path: 'report',
            populate: { path: 'department'}
        })

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


// ADMIN
const getAllByStatus = async(req, res = response ) => { 

    const page = Number(req.query.page) || 1;

    const { status } = req.params;

    try {


        const [services, totalResults] = await Promise.all([
            Service.find({ status })
                .populate('report', 'title')
                .populate('assignedTo', 'name username')
                .populate('user', 'name username')
                .skip((page - 1 )*20)
                .limit(20),  
            Service.countDocuments({ status })
        ]);


        res.status(200).json({
            status: true,
            services,
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



const getListStatus = async(req, res = response) => {

    const status = [
        { value: 'not-assigned', name: 'Sin asignar' },
        { value: 'assigned', name: 'Asignado' },
        { value: 'in-progress', name: 'En proceso' },
        { value: 'finalized', name: 'Finalizado' },
        { value: 'cancelled', name: 'Cancelado' },
        { value: 'pending', name: 'Pendiente' },
    ]

    res.json({
        status
    })
}



const getListSeverities = async(req, res = response) => {

    const severities = [
        { value: 'low', name: 'Bajo' },
        { value: 'elevated', name: 'Normal' },
        { value: 'high', name: 'Alta' },
        { value: 'severe', name: 'Urgente' },
    ]

    res.json({
        severities
    })
}





module.exports = {
    getAllByUserId,
    getAllByAssignedToId,
    getAllByStatus,
    getById,
    getListStatus,
    getListSeverities,
 
}
