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
    }}).populate('report').populate('assignedTo')


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

        const service = new Services( { report } )
        await service.save();


    } catch(error) {
        console.log(error);
        return false;
    }

}



// SERVICIOS


const getAllServicesByUserId = async( userId ) => {
    
    const services = await Services.find({ assignedTo: userId }).sort({ createdAt: 'asc' });
    return services;

}



module.exports = {
    userConnected,
    userDisconnected,
    getAllUsers,
    saveReport,
    getAllReportsByUserId,
    getAllServicesByUserId
}