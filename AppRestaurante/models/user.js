const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nRol: [{
        ref: "Rols",
        type: mongoose.Schema.Types.ObjectId,
        default: []
    }]
});

// hook que se ejecuta antes de guardar un usuario
userSchema.pre('save', async function(){

        if(this.isModified('password')){
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
});

//cuando se hace login, comparar la contraseña
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;