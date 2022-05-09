

const { Schema, model } = require('mongoose');



const ReportSchema = Schema({

    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        require: true
    },
    isAssigned: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


ReportSchema.method('toJSON', function(){
    const { __v,  ...object } = this.toObject();
    // object.uid = _id
    return object;
});



module.exports = model( 'Report', ReportSchema );

