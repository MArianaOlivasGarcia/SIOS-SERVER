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

        const services = await Services.find({ assignedTo: '623e5a9d5516abd648a35230' }, '-user -assignedTo')
        .sort({ createdAt: 'asc' })
        .populate('report');

        res.status(201).json({
            message: `TESTS`,
            status: true,
            services
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