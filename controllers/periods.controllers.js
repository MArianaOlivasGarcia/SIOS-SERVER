
const Period = require('../models/period');

const getAll = async ( req, res ) => {


    const page = Number(req.query.page) || 1;


    try {


        const [periods, totalResults] = await Promise.all([
            Period.find()
                .skip((page - 1 )*20)
                .limit(20),  
                Period.countDocuments()
        ]);


        res.status(200).json({
            status: true,
            periods,
            totalResults
        })


    } catch( error ) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }



}



const getById = async(req, res = response ) => {

    try {
        
        
        const { id } = req.params; 
        const period = await Period.findById( id )


        if ( !period ) {
            res.status(404).json({
                status: false,
                message: `No existe un period con el ID ${id}`
            })
        }

        res.status(200).json({
            status: true,
            period
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


        const period = new Period( req.body );

        await period.save();


        res.status(201).json({
            status: true,
            message: 'Periodo creado con éxito',
            period
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

        const doesExist = await Period.findById(id);

        if ( !doesExist) {
            return res.status(400).json({
                status: false,
                message: `No existe un periodo con el ID ${ id }.`
            })
        }


        const period = await Period.findByIdAndUpdate( id, req.body, { new: true });

        res.status(201).json({
            message: `Periodo editado con éxito`,
            status: true,
            period
        })


    } catch( error ) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }

}






const changeIsActive = async(req, res = response ) => {

    const { id } = req.params;

    try {

        const doesExist = await Period.findOne({ isActive: true });

        if ( doesExist && doesExist.id != id ) {
            return res.status(400).json({
                status: false,
                message: `Ya hay un periodo actual.`
            })
        }


        const period = await Period.findById(id);

        if ( !period) {
            return res.status(400).json({
                status: false,
                message: `No existe un periodo con el ID ${id}.`
            })
        }


        period.isActive = !period.isActive;
        await period.save();


        res.status(201).json({
            message: `Periodo editado con éxito`,
            status: true,
            period
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
    getById,
    create,
    update,
    changeIsActive
}
