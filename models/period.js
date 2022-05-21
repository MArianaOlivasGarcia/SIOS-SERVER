

const { Schema, model } = require('mongoose');



const PeriodSchema = Schema({

    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    finalDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    }

});


PeriodSchema.method('toJSON', function(){
    const { __v,  ...object } = this.toObject();
    // object.uid = _id
    return object;
});



module.exports = model( 'Period', PeriodSchema );

