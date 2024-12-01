const Categoria = require('../models/CategoriasModel');

const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

// servicio para crear una categoria con formidable
exports.crearCategoria = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            maxFileSize: 10 * 1024 * 1024,
            keepExtensions: true
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: 'Error al procesar el formulario' });
            }

            // Validaciones de campos
            if (!fields.nombreCategoria || !fields.nombreCategoria[0]) {
                return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
            }
            if (!fields.descripcionCategoria || !fields.descripcionCategoria[0]) {
                return res.status(400).json({ error: 'La descripción de la categoría es requerida' });
            }
            if (!files.imagen) {
                return res.status(400).json({ error: 'La imagen de la categoría es requerida' });
            }            


            // Manejar la imagen
            let imagenUrl = '';
            if (files.imagen && files.imagen[0]) {
                const file = files.imagen[0];
                const dirPath = path.join(__dirname, '../assets/uploads');
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }

                const fileName = `categoria_${Date.now()}${path.extname(file.originalFilename || '')}`;
                const newPath = path.join(dirPath, fileName);
                fs.renameSync(file.filepath, newPath);
                imagenUrl = `/assets/uploads/${fileName}`;
            }

            // Crear categoria
            const categoria = new Categoria({
                nombreCategoria: fields.nombreCategoria[0],
                descripcionCategoria: fields.descripcionCategoria[0],
                estadoCategoria: fields.estadoCategoria ? fields.estadoCategoria[0] === 'true' : true,
                imagenCategoria: imagenUrl
            });

            const categoriaGuardada = await categoria.save();
            res.status(201).json(categoriaGuardada);
        });

    } catch (error) {
        console.error('Error en crearCategoria:', error);
        res.status(500).send('Error al crear la categoría');
    }
};

// servicio para obtener todas las categorias
exports.obtenerCategorias = async (req, res) => {
    try{
        const categorias = await Categoria.find();
        res.status(200).send(categorias);
    }catch(error){
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
    try{
        const { id } = req.params;

        let pNombre = req.body.nombreCategoria;
        let pDescripcion = req.body.descripcionCategoria;
        let pImagen = req.body.imagenCategoria;
        let pEstado = req.body.estadoCategoria;
        let pFechaCreacion = req.body.fechaCreacionCategoria;

        if(!pNombre){
            return res.status(400).send("El nombre de la categoria es obligatorio");
        }
        if(!pDescripcion){
            return res.status(400).send("La descripcion de la categoria es obligatoria");
        }
        if(!pImagen){
            return res.status(400).send("La imagen de la categoria es obligatoria");
        }
        if(pEstado === undefined){
            return res.status(400).send("El estado de la categoria es obligatorio");
        }

        const categoria = {
            nombreCategoria: pNombre,
            descripcionCategoria: pDescripcion,
            imagenCategoria: pImagen,
            estadoCategoria: pEstado,
            fechaCreacionCategoria: pFechaCreacion
        }

        const categoriaActualizada = await Categoria.findByIdAndUpdate(id, categoria, {new: true});
        
        if(categoriaActualizada){
            res.status(200).send(categoriaActualizada);
        }else{
            res.status(404).send("Categoria no encontrada");
        }

    }catch(error){
        console.log("Error en updateCategoria: ", error);
        res.status(500).send("Hubo un error en el servidor");
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