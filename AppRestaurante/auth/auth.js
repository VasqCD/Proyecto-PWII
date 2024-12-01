
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Rols = require('../models/rols');

// por seguridad el secretKey sea una variable de entorno
// se coloca aqui para simplificar el ejemplo
const SECRET_KEY = 'TareaProyectoIIParcial';

// controlador para el registro de usuarios
exports.signUp = async (req, res) => {
    try{
        const pNombre = req.body.nombre;
        const pEmail = req.body.email;
        const pPassword = req.body.password;
        const pRol = req.body.nRol;

        if(!pNombre){
            return res.status(400).send("El nombre es obligatorio");
        }
        if(!pEmail){
            return res.status(400).send("El email es obligatorio");
        }
        if(!pPassword){
            return res.status(400).send("El password es obligatorio");
        }

        // expresiones regulares para validar el email
        let validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        if (!validEmail.test(pEmail)) {
            res.status(400).send("El email no es valido");
            return;
        }

        // validar que el email no exista en la base de datos
        const userVerify = await User.findOne({email: pEmail});
        if(userVerify){
            return res.status(400).send("El email ya existe");
        }

        let rolAsignado;
        if (pRol) {
            rolAsignado = await Rols.findOne({ nombre: pRol });
            if (!rolAsignado) {
                return res.status(400).send("El rol especificado no existe");
            }
        } else {
            rolAsignado = await Rols.findOne({ nombre: "user" });
        }

        // crear el usuario
        const user = new User({
            nombre: pNombre,
            email: pEmail,
            password: pPassword,
            nRol: [rolAsignado._id]
        });

        const saveUser = await user.save();

        const payload = {
            id: saveUser.id,
            nombre: saveUser.nombre,
            email: saveUser.email,
            nRol: saveUser.nRol
        };

        // crear el token
        const token = jwt.sign(payload, SECRET_KEY, {
            expiresIn: 86400 // 24 horas
        });

        res.status(201).send({saveUser, token, rolAsignado: rolAsignado.nombre});

    }catch(error){
        console.log("Error en signUp: ", error);
        res.status(500).send("Hubo un error en el servidor");
    }
};

// controlador para el login
exports.signIn = async (req, res) => {
    try{
        const pEmail = req.body.email;
        const pPassword = req.body.password;

        const user = await User.findOne({email: req.body.email});
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
            nRol: user.nRol
        };

        const token = jwt.sign(payload, SECRET_KEY, {
            expiresIn: 86400 // 24 horas
        });

        res.status(200).send({user, token});

    }catch(error){
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