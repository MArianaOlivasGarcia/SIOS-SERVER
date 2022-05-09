

const { Schema, model } = require('mongoose');

// Roles validos
// const rolesValidos = {
//     values: ['ADMIN_ROLE', 'USER_ROLE', 'SITE_ROLE'],
//     message: '{VALUE} no es un rol válido'
// }

const UserSchema = Schema({

    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'https://icon-library.com/images/no-user-image-icon/no-user-image-icon-3.jpg' 
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        // enum: rolesValidos
    },
    online: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },

});


UserSchema.method('toJSON', function(){
    const { __v, password,  ...object } = this.toObject();
    // object.uid = _id
    return object;
});



module.exports = model( 'User', UserSchema );

