const { Router } = require('express');

const moment = require('moment')
const User = require('../models/user');
const Department = require('../models/department');
const Report = require('../models/report');
const Services = require('../models/service');

const today = moment().startOf('day')



const router = Router();


router.get('/', async(req, res) => {
    
    try {

        const service = await Services.findById('624b342674c961e461db6de5')
       

        if ( !service ) {
            return res.status(404).json({
                status: false,
                message: `No existe un servicio con el ID ${'624b342674c961e461db6de5'}`
            })
        }

        if ( service.status == 'finalized' ) {
            return res.status(400).json({
                status: false,
                message: `No puedes asignar personal a un servicio finalizado.`
            })
        }

        if ( service.status == 'assigned' || service.status == 'in-progress' ) {
            return res.status(400).json({
                status: false,
                message: `Ya hay personal trabajando en este reporte, para re asignar debes primero cancelar.`
            })
        }

        res.json({
            service
        })
 

    } catch( error ) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }


});





module.exports = router;