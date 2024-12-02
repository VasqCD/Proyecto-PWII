const Categoria = require('../models/CategoriasModel');

const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

// servicio para crear una categoria con formidable
exports.crearCategoria = async (req, res) => {
    try {
        const { nombreCategoria, descripcionCategoria, tipoCategoria, estadoCategoria } = req.body;

        // Validaciones
        if (!nombreCategoria) {
            return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
        }
        if (!descripcionCategoria) {
            return res.status(400).json({ error: 'La descripción de la categoría es requerida' });
        }
        if (!tipoCategoria) {
            return res.status(400).json({ error: 'El tipo de categoría es requerido' });
        }
        if (!['PRODUCTOS', 'BEBIDAS'].includes(tipoCategoria.toUpperCase())) {
            return res.status(400).json({ error: 'El tipo de categoría debe ser PRODUCTOS o BEBIDAS' });
        }

        // Crear categoria
        const categoria = new Categoria({
            nombreCategoria,
            descripcionCategoria,
            tipoCategoria: tipoCategoria.toUpperCase(),
            estadoCategoria: estadoCategoria !== undefined ? estadoCategoria : true
        });

        const categoriaGuardada = await categoria.save();
        res.status(201).json(categoriaGuardada);

    } catch (error) {
        console.error('Error en crearCategoria:', error);
        res.status(500).send('Error al crear la categoría');
    }
};

// servicio para obtener todas las categorias
exports.obtenerCategorias = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 10;
        
        const skip = (pagina - 1) * limite;

        const [categorias, total] = await Promise.all([
            Categoria.find()
                .skip(skip)
                .limit(limite),
            Categoria.countDocuments()
        ]);

        const totalPaginas = Math.ceil(total / limite);

        res.status(200).json({
            categorias,
            paginaActual: pagina,
            totalPaginas,
            totalRegistros: total
        });

    } catch (error) {
        console.log("Error en obtenerCategorias: ", error);
        res.status(500).send("Hubo un error en el servidor");
    }
};

// servicio para obtener una categoria por id
exports.obtenerCategoriasPorId = async (req, res) => {
    try{
        const { id } = req.params;
        const categoria = await Categoria.findById(id);
        if(categoria){
            res.status(200).send(categoria);
        }else{
            res.status(404).send("Categoria no encontrada");
        }

    }catch(error){
        console.log("Error en obtenerCategoriasPorId: ", error);
        res.status(500).send("Hubo un error en el servidor");
    }
};

// servicio para actualizar una categoria
exports.updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreCategoria, descripcionCategoria, tipoCategoria, estadoCategoria } = req.body;

        // Validaciones
        if (!nombreCategoria) {
            return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
        }
        if (!descripcionCategoria) {
            return res.status(400).json({ error: 'La descripción de la categoría es requerida' });
        }
        if (!tipoCategoria) {
            return res.status(400).json({ error: 'El tipo de categoría es requerido' });
        }
        if (!['PRODUCTOS', 'BEBIDAS'].includes(tipoCategoria.toUpperCase())) {
            return res.status(400).json({ error: 'El tipo de categoría debe ser PRODUCTOS o BEBIDAS' });
        }

        const categoriaActualizada = await Categoria.findByIdAndUpdate(
            id, 
            {
                nombreCategoria,
                descripcionCategoria,
                tipoCategoria: tipoCategoria.toUpperCase(),
                estadoCategoria
            },
            { new: true }
        );

        if (categoriaActualizada) {
            res.status(200).json(categoriaActualizada);
        } else {
            res.status(404).json({ error: 'Categoría no encontrada' });
        }

    } catch (error) {
        console.error('Error en updateCategoria:', error);
        res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
};

// servicio para eliminar una categoria
exports.deleteCategoria = async (req, res) => {
    try{
        const { id } = req.params;
        const eliminarCategoria = await Categoria.findByIdAndDelete(id);

        if(eliminarCategoria){
            res.status(200).send(eliminarCategoria);
        }else{
            res.status(404).send("Categoria no encontrada");
        }
    }catch(error){
        console.log("Error en deleteCategoria: ", error);
        res.status(500).send("Hubo un error en el servidor");
    }
}



// investigacion 1: subir archivos al servidor

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

            // Crear nombre único y mover archivo
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