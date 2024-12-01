const mongoose = require('mongoose');

// definiendo el esquema
const  ProductoSchema = new mongoose.Schema({
    nombreProducto: String,
    descripcionProducto: String,
    precioProducto: Number,
    categoriaProducto: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
    estadoProducto: Boolean
});

// definiendo el modelo
const Producto = mongoose.model('Producto', ProductoSchema);

module.exports = Producto; // exportando el modelo 