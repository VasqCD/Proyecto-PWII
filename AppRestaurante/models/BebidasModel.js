
const mongoose = require('mongoose');

// definiendo el esquema
const  BebidaSchema = new mongoose.Schema({
    nombreBebida: String,
    descripcionBebida: String,
    precioBebida: Number,
    categoriaBebida: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Categoria' 
    },
    estadoBebida: Boolean,
    imagenBebida: String
});

// definiendo el modelo
const Bebida = mongoose.model('Bebida', BebidaSchema);

module.exports = Bebida; // exportando el modelo