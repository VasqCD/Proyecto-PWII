
const RolesController = require('../controllers/RolesController');
const auth = require('../auth/auth');

module.exports = (app) => {
    // Obtener todos los roles (solo admin)
    app.get('/roles', 
        auth.authenticate,
        auth.checkRol(['admin']),
        RolesController.obtenerRoles
    );
};