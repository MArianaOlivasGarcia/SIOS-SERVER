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

        const services = await Services.find({ status: 'not-assigned' })
        .sort({ createdAt: 'desc' })
        .populate('report')
        .populate({
            path: 'report',
            populate: { path: 'department'}
        })

        res.json({
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