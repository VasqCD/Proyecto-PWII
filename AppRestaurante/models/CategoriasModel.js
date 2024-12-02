const mongoose = require("mongoose");

// definiendo el esquema
const CategoriaSchema = new mongoose.Schema({
    nombreCategoria: String,
    descripcionCategoria: String,
    tipoCategoria: {
        type: String,
        enum: ["PRODUCTOS", "BEBIDAS"],
        required: true,
    },
    estadoCategoria: { type: Boolean, default: true },
    fechaCreacionCategoria: { type: Date, default: Date.now },
});

const Categoria = mongoose.model("Categoria", CategoriaSchema);

module.exports = Categoria; // exportando el modelo
