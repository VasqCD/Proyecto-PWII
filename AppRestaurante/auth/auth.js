
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Rols = require('../models/rols');

// por seguridad el secretKey sea una variable de entorno
// se coloca aqui para simplificar el ejemplo
const SECRET_KEY = 'TareaProyectoIIParcial';

// controlador para el registro de usuarios
exports.signUp = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validaciones básicas
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Verificar si el usuario ya existe
        const existeUsuario = await User.findOne({ email });
        if (existeUsuario) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Buscar el rol "user" por defecto
        const rolUsuario = await Rols.findOne({ nombre: 'user' });
        if (!rolUsuario) {
            return res.status(400).json({ error: 'Error en la configuración de roles' });
        }

        // Crear el usuario con el rol por defecto
        const usuario = new User({
            nombre,
            email,
            password,
            nRol: [rolUsuario._id]
        });

        await usuario.save();

        // Generar token
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            nRol: usuario.nRol
        }, SECRET_KEY, { expiresIn: 86400 });

        res.status(201).json({
            mensaje: 'Usuario creado exitosamente',
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: rolUsuario.nombre
            },
            token
        });

    } catch (error) {
        console.error('Error en signUp:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

// controlador para el login
exports.signIn = async (req, res) => {
    try {
        const pEmail = req.body.email;
        const pPassword = req.body.password;

        const user = await User.findOne({email: req.body.email}).populate('nRol', 'nombre');
        if(!user || user == null){
            res.status(400).send("El correo o la contraseña son incorrectos");
            return;
        }

        const isMatch = await bcrypt.compare(pPassword, user.password); 
        if(!isMatch){
            res.status(400).send("El correo o la contraseña son incorrectos");
            return;
        }

        const payload = {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            nRol: user.nRol.map(rol => rol.nombre)
        };

        const token = jwt.sign(payload, SECRET_KEY, {
            expiresIn: 86400
        });

        res.status(200).json({
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                roles: user.nRol.map(rol => rol.nombre)
            }, 
            token
        });
    } catch(error) {
        console.log("Error en lognIn: ", error);
        res.status(500).send("Hubo un error en el servidor");
    }
};

// middleware
exports.authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(401).send("Falta el token de autenticación");
        return;
    }

    const [type, token] = authHeader.split(' ');
    if(type !== 'Bearer'){
        res.status(401).send("Tipo de token inválido");
        return;
    }

    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        console.log(decoded);
        next();

    }catch(error){
        res.status(401).send("Token inválido");
        return;
    }

}

// middleware para verificar el rol
exports.checkRol = (nRolPermitidos) => {
    return async (req, res, next) => {
        try {
            // Obtener usuario con nRol populados
            const user = await User.findById(req.user.id)
                .populate('nRol', 'nombre'); // Agregar populate con el campo nombre
            
            if (!user || !user.nRol) {
                return res.status(403).json({
                    mensaje: "Usuario no tiene nRol asignados"
                });
            }

            // Verificar si el usuario tiene alguno de los nRol permitidos
            const tieneRol = user.nRol.some(rol => nRolPermitidos.includes(rol.nombre));
            
            if (!tieneRol) {
                return res.status(403).json({
                    mensaje: "No privilegios para realizar la accion",
                    nRolUsuario: user.nRol.map(r => r.nombre),
                    nRolRequeridos: nRolPermitidos
                });
            }
            
            next();
        } catch (error) {
            console.log("Error en checkRol:", error);
            return res.status(500).send("Error verificando nRol");
        }
    };
};