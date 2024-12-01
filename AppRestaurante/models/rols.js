const mongoose = require('mongoose');

const RolsSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    }
});

const Rols = mongoose.model('Rols', RolsSchema);

module.exports = Rols;