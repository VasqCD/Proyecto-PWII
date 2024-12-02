
const Rols = require('../models/rols');

exports.obtenerRoles = async (req, res) => {
    try {
        const roles = await Rols.find();
        res.status(200).json(roles);
    } catch (error) {
        console.error("Error en obtenerRoles:", error);
        res.status(500).json({ error: "Error al obtener roles" });
    }
};