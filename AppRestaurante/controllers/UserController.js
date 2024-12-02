
const User = require('../models/user');
const Rols = require('../models/rols');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios con paginación
exports.obtenerUsuarios = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 10;
        const skip = (pagina - 1) * limite;

        const usuarios = await User.find()
            .select('-password') // Excluir password
            .populate('nRol', 'nombre')
            .skip(skip)
            .limit(limite);

        const total = await User.countDocuments();

        res.status(200).json({
            usuarios,
            paginaActual: pagina,
            totalPaginas: Math.ceil(total / limite),
            total
        });
    } catch (error) {
        console.error("Error en obtenerUsuarios:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

// Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id)
            .select('-password')
            .populate('nRol', 'nombre');

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error("Error en obtenerUsuarioPorId:", error);
        res.status(500).json({ error: "Error al obtener usuario" });
    }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const { nombre, email, password, nRol } = req.body;
        const usuarioActualizado = {};

        if (nombre) usuarioActualizado.nombre = nombre;
        if (email) usuarioActualizado.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            usuarioActualizado.password = await bcrypt.hash(password, salt);
        }
        if (nRol) {
            // Verificar que los roles existan
            const rolesExistentes = await Rols.find({ _id: { $in: nRol } });
            if (rolesExistentes.length !== nRol.length) {
                return res.status(400).json({ error: 'Uno o más roles no existen' });
            }
            usuarioActualizado.nRol = nRol;
        }

        const usuario = await User.findByIdAndUpdate(
            req.params.id,
            usuarioActualizado,
            { new: true }
        )
        .select('-password')
        .populate('nRol', 'nombre');

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error("Error en actualizarUsuario:", error);
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        const usuario = await User.findByIdAndDelete(req.params.id)
            .select('-password');

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ mensaje: 'Usuario eliminado correctamente', usuario });
    } catch (error) {
        console.error("Error en eliminarUsuario:", error);
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};