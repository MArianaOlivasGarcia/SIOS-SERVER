


const { response } = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Department = require('../models/department');
const { generarJWT } = require('../helpers/jwt.helper');
const { getMenuFrontEnd } = require('../helpers/ui.helper');




const register = async(req, res = response ) => {

    const { username, password, role } = req.body;

    try {

        const rolesValidos = ['ADMIN_ROLE', 'USER_ROLE', 'SITE_ROLE'];

        if( rolesValidos.indexOf( role.toUpperCase() ) < 0 ){

            return res.status(400).json({
                status: false,
                message: `El role ${ role } no es válido, los roles permitidos son ${rolesValidos.join(', ')}`
            })
    
        }

        
        const doesExist = await User.findOne({ username });

        if (doesExist) {
            return res.status(400).json({
                status: false,
                message: `Ya existe un usuario con el username ${ username }.`
            })
        }

        const data = {
            ...req.body,
            role: role.toUpperCase()
        }

        const user = new User(data);
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        const savedUser = await user.save();
        const accessToken = await generarJWT(savedUser.id, savedUser.role);

        res.status(201).json({
            accessToken,
            menu: getMenuFrontEnd( user.role ),
            message: `Usuario creado con éxito`,
            status: true,
            user: savedUser,
        })


    } catch( error ) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }

}


const login = async(req, res = response) => {

    const { username, password } = req.body;

    try {

        const user = await User.findOne({ username })


        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Username inválido.'
            })
        }


        const validarPassword = bcrypt.compareSync( password, user.password)


        if (!validarPassword) {
            return res.status(404).json({
                status: false,
                message: 'Contraseña inválida.'
            });
        }


        let deptartament;
        if ( user.role == 'USER_ROLE' ) {
            deptartament = await Department.findOne({ user }, '_id name ubication')

            if ( !deptartament ) {
                return res.status(404).json({
                    status: false,
                    message: 'Este usuario no está asociado a un departamento.'
                });
            }
        }

        const accessToken = await generarJWT(user.id, user.role);


        res.status(200).json({
            accessToken,
            deptartament,
            menu: getMenuFrontEnd( user.role ),
            status: true,
            user,
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }
    
}


const renewJWT = async(req, res = response) => {

    const id = req.id
    const role = req.role
    const accessToken = await generarJWT(id, role)
    const user = await User.findById(id)


    let deptartament;
    if ( user.role == 'USER_ROLE' ) {
        deptartament = await Department.findOne({ user }, '_id name ubication')
    }

    res.json({
        accessToken,
        deptartament,
        menu: getMenuFrontEnd( user.role ),
        status: true,
        user,
    })
}


const getListRoles = async(req, res = response) => {

    const roles = [
        { value: 'ADMIN_ROLE', name: 'Administrador' },
        { value: 'SITE_ROLE', name: 'Cómputo' },
        { value: 'USER_ROLE', name: 'Departamento' },
    ]

    res.json({
        roles
    })
}


module.exports = {
    register,
    login,
    renewJWT,
    getListRoles
}
