
const BebidasController = require('../controllers/BebidasController');
const auth = require('../auth/auth');

module.exports = (app) => {
    // crear una bebida
    app.post('/bebidas', auth.authenticate, 
        auth.checkRol(['admin', 'gerente']),
        BebidasController.crearBebida);

    // obtener todas las bebidas
    app.get('/bebidas', 
        auth.authenticate,
        auth.checkRol(['admin', 'gerente', 'user']),
        BebidasController.obtenerBebidas);

    // obtener una bebida por id
    app.get('/bebidas/:id', 
        auth.authenticate,
        auth.checkRol(['admin', 'gerente', 'user']),
        BebidasController.obtenerBebidaPorId);

    // actualizar una bebida
    app.put('/bebidas/:id', auth.authenticate, 
        auth.checkRol(['admin', 'gerente']),
        BebidasController.updateBebida);

    // eliminar una bebida
    app.delete('/bebidas/:id', auth.authenticate, 
        auth.checkRol(['admin']),
        BebidasController.eliminarBebida);
}