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



const calificarService = async( payload ) => {

    /* 
        {
            from: '', id usuario departamento
            to: '', id usuario admin
            service: id servicio
            grade: {
                score
                comment
            }
        } 
    */

    try {

        const { service, grade } = payload;

        const servicedb = await Services.findById( service );

        if ( !servicedb) {
            return { message: `No existe un servicio con el ID ${ id }` }
        }

        servicedb.score = grade.score;
        servicedb.comment = grade.comment;

        await servicedb.save();

        return servicedb;
        

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





const getAllServices = async( ) => {
    
    const services = await Services.find({ status: 'not-assigned' })
        .sort({ createdAt: 'desc' })
        .populate('report')
        .populate({
            path: 'report',
            populate: { path: 'department'}
        })
    return services;

}




const assignService = async ( payload ) => {

    /* 
        {
            from: '', id admin
            to: '', id site
            service: id servicio,
            severity: low
        } 
    */

        const service = await Services.findById( payload.service );

        if ( !service ) {
            return { error: `No existe un servicio con el ID ${ payload.service }` }
        }

        service.status = 'assigned'; 
        service.assignedTo = payload.to; 
        service.severity = payload.severity; 

        const report = await Report.findById( service.report );

        if ( !report ) {
            return { error: `No existe un reporte con el ID ${ service.report }` }
        }

        report.isAssigned = true;

        await Promise.all([
            service.save() ,
            report.save() 
        ])

        return service;


}



const finalizedService = async( payload ) => {

    /*
    
        {
            to: id admin,
            from: id site,
            service: {}
        }
    
    */

        
        const exist = await Services.findById( payload.id );

        if ( !exist ) {
            return { error: `No existe un servicio con el ID: ${ payload.id }` }
        }

        const data = {
            ...payload.service,
            status: 'finalized'
        }

        const service = await Services.findByIdAndUpdate( payload.id, data, { new: true });

        return service;

}

module.exports = {
    userConnected,
    userDisconnected,
    getAllUsers,
    saveReport,
    getAllReportsByUserId,
    getAllServicesByUserId,
    editReport,
    calificarService,
    getAllServices,
    assignService,
    finalizedService
}