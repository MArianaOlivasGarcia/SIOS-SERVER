

const { Schema, model } = require('mongoose');



const ServiceSchema = Schema({

    report: {
        type: Schema.Types.ObjectId,
        ref: 'Report',
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    folio: {
        type: String
    },
    feedback: {
        type: String
    },
    status: {
        type: String,
        default: 'not-assigned'
    },
    // not-assigned, assigned, in-progress , finalized, cancelled, pending
    // sin asignar, asignado, en proceso, finalizado, cancelado, pendiente...
    

    // POR EL USUARIO UNA VEZ FINALIZADO
    score:{
        type: String
    },
    comment: {
        type: String
    }
    

}, { timestamps: true });


ServiceSchema.method('toJSON', function(){
    const { __v,  ...object } = this.toObject();
    // object.uid = _id
    return object;
});



module.exports = model( 'Service', ServiceSchema );

