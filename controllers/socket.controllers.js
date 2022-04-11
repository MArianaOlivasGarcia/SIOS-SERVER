const moment = require('moment')
const User = require('../models/user');
const Department = require('../models/department');
const Report = require('../models/report');
const Services = require('../models/service');

const today = moment().startOf('day')


const userConnected = async( id ) => {

    const user = await User.findById(id);
    user.online = true;
    await user.save();
    return user;

}


const userDisconnected = async( id ) => {

    const user = await User.findById(id);
    user.online = false;
    await user.save();
    return user;

}


const getAllUsers = async( ) => {
    
    const users = await User.find().sort('-online');
    return users;

}





// REPORTES 

const getAllReportsByUserId = async( userId ) => {
    
    // const reports = await Report.find({ depto: userId, isAssigned: false }, '-isAssigned -department').sort({ createdAt: 'asc' });
    // return reports;

    const services = await Services.find({ createdAt: {
        $gte: today.toDate(),
        $lte: moment(today).endOf('day').toDate()
    }}, '-user').populate('report').populate('assignedTo')


    return services;




}



const saveReport = async( payload ) => {

    /* 
        {
            from: '', usuario departamento
            to: '', usuario admin
            report: ''
        } 
    */

    try {


        
        // const doesExist = await Department.findById( payload.from );
        const department = await Department.findOne({ user: payload.from })

        const data = {
            ...payload.report,
            department: department.id
        }

        const report = new Report( data )
        await report.save();

        const service = new Services( { report, user: payload.from } )
        await service.save();

        return service;

    } catch(error) {
        console.log(error);
        return false;
    }

}




const editReport = async( payload ) => {

    /* 
        {
            from: '', usuario departamento
            to: '', usuario admin
            report: ''
        } 
    */

    try {

        const { _id: id } = payload.report;

        const doesExist = await Report.findById( id );

        if ( !doesExist) {
            return { message: `No existe un reporte con el ID ${ id }` }
        }


        await Report.findByIdAndUpdate( id, payload.report, { new: true })

        const service = await Services.findOne({ report: id })

        return service;
        

    } catch(error) {
        console.log(error);
        return false;
    }

}



// SERVICIOS


const getAllServicesByUserId = async( userId ) => {
    
    const services = await Services.find({ assignedTo: userId }, '-user -assignedTo')
    .sort({ createdAt: 'asc' })
    .populate('report')
    .populate({
        path: 'report',
        populate: { path: 'department'}
    })
    return services;

}



module.exports = {
    userConnected,
    userDisconnected,
    getAllUsers,
    saveReport,
    getAllReportsByUserId,
    getAllServicesByUserId,
    editReport
}