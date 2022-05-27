

const Service = require('../models/service');

const searchBitacora = async(req, res = response) => {

    const query = req.params.query;
    const regex = new RegExp( query, 'i')

    const [ bitacora ] = await Promise.all([
        Service.find( { $or: [{description: regex },{solution: regex}]}, 'description solution' )
    ])

    res.json({
        status: true,
        bitacora
    })

}



module.exports = {
    searchBitacora
}