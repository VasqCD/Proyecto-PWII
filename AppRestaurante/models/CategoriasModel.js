const mongoose = require('mongoose');

// definiendo el esquema
const CategoriaSchema = new mongoose.Schema({
    nombreCategoria: String,
    descripcionCategoria: String,
    estadoCategoria: { type: Boolean, default: true },
    fechaCreacionCategoria: { type: Date, default: Date.now },
    imagenCategoria: String
});

const Categoria = mongoose.model('Categoria', CategoriaSchema);

module.exports = Categoria; // exportando el modelo