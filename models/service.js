

const { Schema, model } = require('mongoose');



const ServiceSchema = Schema({

    report: {
        type: Schema.Types.ObjectId,
        ref: 'Report',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    folio: {
        type: String
    },
    status: {
        type: String,
        default: 'not-assigned'
    },
    // not-assigned, assigned, in-progress , finalized, cancelled, pending
    // sin asignar, asignado, en proceso, finalizado, cancelado, pendiente...
    
    feedback: {
        type: String
    },
    description: {
        type: String
    },
    solution: {
        type: String
    },
    device: {
        type: [String]
    },
    staff: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
    },

    // POR EL ADMINSTRADOR
    severity: { //low, elevated, high, severe
        type: String
    },


    // POR EL USUARIO UNA VEZ FINALIZADO
    score:{ // 0 al 10
        type: Number
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

