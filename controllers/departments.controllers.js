


const { response } = require('express');
const User = require('../models/user');
const Department = require('../models/department');

const getAll = async(req, res = response ) => {

    try {

        const departments = await Department.find({}).populate('user')

        res.status(201).json({
            status: true,
            departments
        })


    } catch( error ) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }

}



const create = async(req, res = response ) => {

    try {

        const { user } = req.body

        // Validar que el usuario sea "USER_ROLE"
        const userdb = await User.findById( user )

        if ( userdb.role != 'USER_ROLE' ) {
            return res.status(400).json({
                status: false,
                message: `No se puede asignar un usuario tipo ${ userdb.role } a un departamento.`,
            })
        }

        // Validar que no haya un departamento asignado a ese usuario
        const departmentExist = await Department.findOne({ user }).populate('user');

        if ( departmentExist ) {
            return res.status(400).json({
                status: false,
                message: 'Ya existe un departamento asignado a ese usuario',
            })
        }


        const department = new Department( req.body );

        await department.save();


        res.status(201).json({
            status: true,
            message: 'Departamento creado con éxito',
            department
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

    const { id } = req.params;

    try {

        const doesExist = await Department.findById(id);

        if ( !doesExist) {
            return res.status(400).json({
                status: false,
                message: `No existe un departamento con el ID ${ id }.`
            })
        }


        const department = await Department.findByIdAndUpdate( id, req.body, { new: true })
            .populate('user');

        res.status(201).json({
            message: `Departamento editado con éxito`,
            status: true,
            department
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
    getAll,
    create,
    update
}
