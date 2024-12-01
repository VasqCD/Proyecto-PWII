
const ProductosController = require('../controllers/ProductosController');
const auth = require('../auth/auth');

module.exports = (app) => {
    // crear un producto
    app.post('/productos', 
        auth.authenticate, 
        auth.checkRol(['admin', 'gerente']),
        ProductosController.crearProducto
    );

    // obtener todos los productos
    app.get('/productos',
        ProductosController.obtenerProductos
    );

    // obtener un producto por id
    app.get('/productos/:id', 
        auth.authenticate, 
        auth.checkRol(['admin', 'gerente', 'user']),
        ProductosController.obtenerProductoPorId
    );

    // actualizar un producto
    app.put('/productos/:id', 
        auth.authenticate, 
        auth.checkRol(['admin', 'gerente']),
        ProductosController.updateProducto
    );

    // eliminar un producto
    app.delete('/productos/:id', 
        auth.authenticate, 
        auth.checkRol(['admin']), 
        ProductosController.eliminarProducto
    );

    // subir archivo
    app.post('/productos/upload', 
        auth.authenticate,
        auth.checkRol(['admin', 'gerente', 'user']),
        ProductosController.subirArchivo);
    
    // obtener productos por categoria
    app.get('/productos/categoria/:nombreCategoria', 
        auth.authenticate, 
        auth.checkRol(['admin', 'gerente', 'user']),
        ProductosController.obtenerProductosPorCategoria);
}
