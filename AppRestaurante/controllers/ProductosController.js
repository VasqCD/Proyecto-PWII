const Producto = require('../models/ProductosModel');
const Categoria = require('../models/CategoriasModel');

// servicio para crear un producto
exports.crearProducto = async (req, res) => {
    try {
        let pNombre = req.body.nombreProducto;
        let pDescripcion = req.body.descripcionProducto;
        let pPrecio = req.body.precioProducto;
        let pCategoria = req.body.categoriaProducto;
        let pEstado = req.body.estadoProducto;

        

        // validar que se llenen todos los campos
        if (!pNombre) {
            return res.status(400).send("El nombre del producto es obligatorio");
        }
        if (!pDescripcion) {
            return res.status(400).send("La descripcion del producto es obligatoria");
        }
        if (!pPrecio) {
            return res.status(400).send("El precio del producto es obligatorio");
        }
        if (!pCategoria) {
            return res.status(400).send("La categoria del producto es obligatoria");
        }
        if (pEstado === undefined) {
            return res.status(400).send("El estado del producto es obligatorio");
        }

        const categoria = await Categoria.findOne({ 
            nombreCategoria: { $regex: pCategoria, $options: 'i' } 
        });

        if (!categoria) {
            return res.status(404).send(`La categoría ${pCategoria} no existe`);
        }

        let producto = new Producto({
            nombreProducto: pNombre,
            descripcionProducto: pDescripcion,
            precioProducto: pPrecio,
            categoriaProducto: categoria._id,
            estadoProducto: pEstado
        });

        // guardar el producto en la base de datos
        const productoGuardado = await producto.save();
        res.status(201).send(productoGuardado);

    } catch (error) {
        console.log("Error en crearProducto: ", error);
        res.status(500).send("Hubo un error en el servidor");
    }
};

// servicio para obtener todos los productos 
// incluye la paginación
exports.obtenerProductos = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1; 
        const limite = parseInt(req.query.limite) || 10; 
        const skip = (pagina - 1) * limite;

        const productos = await Producto.find()
            .skip(skip)
            .limit(limite);

        const totalProductos = await Producto.countDocuments();
        const totalPaginas = Math.ceil(totalProductos / limite);

        res.status(200).json({
            productos,
            paginaActual: pagina,
            totalPaginas,
            totalProductos
        });

    } catch (error) {
        console.log("Error en obtenerProductos: ", error);
        res.status(500).send("Hubo un error en el servidor");
    }
};

// servicio para obtener un producto por id
exports.obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findById(id);
        if (producto) {
            res.status(200).send(producto);
        } else {
            res.status(404).send("Producto no encontrado");
        }

    } catch (error) {
        console.log("Error en obtenerProductoPorId: ", error);
        res.status(500).send("Hubo un error en el servidor");
    }
};

// servicio para actualizar un producto
exports.updateProducto = async (req, res) => {
    try {
        const { id } = req.params;

        let pNombre = req.body.nombreProducto;
        let pDescripcion = req.body.descripcionProducto;
        let pPrecio = req.body.precioProducto;
        let pCategoria = req.body.categoriaProducto;
        let pEstado = req.body.estadoProducto;

        if (!pNombre) {
            return res.status(400).send("El nombre del producto es obligatorio");
        }
        if (!pDescripcion) {
            return res.status(400).send("La descripcion del producto es obligatoria");
        }
        if (!pPrecio) {
            return res.status(400).send("El precio del producto es obligatorio");
        }
        if (!pCategoria) {
            return res.status(400).send("La categoria del producto es obligatoria");
        }
        if (pEstado === undefined) {
            return res.status(400).send("El estado del producto es obligatorio");

        }

        const producto = {
            nombreProducto: pNombre,
            descripcionProducto: pDescripcion,
            precioProducto: pPrecio,
            categoriaProducto: pCategoria,
            estadoProducto: pEstado
        }

        const productoActualizado = await Producto.findByIdAndUpdate(id, producto, { new: true });

        if (productoActualizado) {
            res.status(200).send(productoActualizado);
        } else {
            res.status(404).send("Producto no encontrado");
        }

    } catch (error) {
        console.log("Error en updateProducto: ", error);
        res.status(500).send("Hubo un error en el servidor");
    }
};

// servicio para eliminar un producto
exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminarProducto = await Producto.findByIdAndDelete(id);

        if (eliminarProducto) {
            res.status(200).send(eliminarProducto);
        } else {
            res.status(404).send("Producto no encontrado");
        }

    } catch (error) {
        console.log("Error en eliminarProducto: ", error);
        res.status(500).send("Hubo un error en el servidor");
    }
};

// servicio para subir archivos
exports.subirArchivo = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            maxFileSize: 10 * 1024 * 1024, // hasta 10 megas para subir arivos
            keepExtensions: true
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: 'Error al procesar el archivo' });
            }

            const file = files.archivo[0];
            if (!file) {
                return res.status(400).json({ error: 'No se ha enviado ningún archivo' });
            }

            // Crear directorio si no existe
            const dirPath = path.join(__dirname, '../assets/uploads');
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            const fileName = `file_${Date.now()}${path.extname(file.originalFilename || '')}`;
            const newPath = path.join(dirPath, fileName);
            fs.renameSync(file.filepath, newPath);

            const fileUrl = `/assets/uploads/${fileName}`;

            res.status(200).json({
                mensaje: 'Archivo subido correctamente',
                url: fileUrl,
                nombre: fileName
            });
        });

    } catch (error) {
        console.error('Error al subir archivo:', error);
        res.status(500).send('Error al procesar el archivo');
    }
};

// servicio investigacion
exports.obtenerProductosPorCategoria = async (req, res) => {
    try {
        const { nombreCategoria } = req.params;
        
        // Buscar categoria por nombre
        const categoria = await Categoria.findOne({ 
            nombreCategoria: { $regex: nombreCategoria, $options: 'i' } 
        });
        
        if (!categoria) {
            return res.status(404).json({ 
                mensaje: `No se encontró la categoría: ${nombreCategoria}` 
            });
        }

        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 5;
        const skip = (pagina - 1) * limite;

        // Buscar productos usando el ID de la categoria encontrada
        const productos = await Producto.find({ categoriaProducto: categoria._id })
            .populate('categoriaProducto', 'nombreCategoria descripcionCategoria')
            .skip(skip)
            .limit(limite);

        const totalProductos = await Producto.countDocuments({ 
            categoriaProducto: categoria._id 
        });
        const totalPaginas = Math.ceil(totalProductos / limite);

        res.status(200).json({
            productos,
            paginaActual: pagina,
            totalPaginas,
            totalProductos,
            categoria: categoria.nombreCategoria
        });

    } catch (error) {
        console.log("Error en obtenerProductosPorCategoria:", error);
        res.status(500).send("Error al obtener productos por categoría");
    }
};