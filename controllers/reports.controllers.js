

const { response } = require('express');
const { getCategoriesReport } = require('../helpers/ui.helper');

const getCategories = async(req, res = response ) => {

    try {
        
        res.status(201).json({
            status: true,
            categories: getCategoriesReport()
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
    getCategories
}
