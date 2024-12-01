const CategoriasController = require('../controllers/CategoriasController');
const auth = require('../auth/auth');

module.exports = (app) => {
    // crear un categoria
    app.post('/categorias', auth.authenticate, CategoriasController.crearCategoria);

    // obtener todas las categorias
    app.get('/categorias', CategoriasController.obtenerCategorias);

    // obtener una categoria por id
    app.get('/categorias/:id', CategoriasController.obtenerCategoriasPorId);

    // actualizar una categoria
    app.put('/categorias/:id', auth.authenticate, CategoriasController.updateCategoria);

    // eliminar una categoria
    app.delete('/categorias/:id', auth.authenticate, CategoriasController.deleteCategoria);

    // subir archivo
    app.post('/categorias/upload', auth.authenticate, CategoriasController.subirArchivo);
}