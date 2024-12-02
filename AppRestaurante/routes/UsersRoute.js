
const UserController = require('../controllers/UserController');
const auth = require('../auth/auth');

module.exports = (app) => {
    // Obtener todos los usuarios (solo admin)
    app.get('/usuarios', 
        auth.authenticate,
        auth.checkRol(['admin']),
        UserController.obtenerUsuarios
    );

    // Obtener usuario por ID
    app.get('/usuarios/:id',
        auth.authenticate,
        auth.checkRol(['admin']),
        UserController.obtenerUsuarioPorId
    );

    // Actualizar usuario
    app.put('/usuarios/:id',
        auth.authenticate,
        auth.checkRol(['admin']),
        UserController.actualizarUsuario
    );

    // Eliminar usuario
    app.delete('/usuarios/:id',
        auth.authenticate,
        auth.checkRol(['admin']),
        UserController.eliminarUsuario
    );
};