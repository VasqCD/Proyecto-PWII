
const mongoose = require('mongoose');

// definiendo el esquema
const  BebidaSchema = new mongoose.Schema({
    nombreBebida: String,
    descripcionBebida: String,
    precioBebida: Number,
    categoriaBebida: String,
    estadoBebida: Boolean
});

// definiendo el modelo
const Bebida = mongoose.model('Bebida', BebidaSchema);

module.exports = Bebida; // exportando el modelo