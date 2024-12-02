const Bebida = require('../models/BebidasModel');
const Categoria = require('../models/CategoriasModel');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

// servicio para crear una bebida
exports.crearBebida = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            maxFileSize: 10 * 1024 * 1024,
            keepExtensions: true
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: 'Error al procesar el formulario' });
            }

            // Validaciones
            if (!fields.nombreBebida || !fields.nombreBebida[0]) {
                return res.status(400).json({ error: 'El nombre de la bebida es requerido' });
            }
            if (!fields.descripcionBebida || !fields.descripcionBebida[0]) {
                return res.status(400).json({ error: 'La descripción de la bebida es requerida' });
            }
            if (!fields.precioBebida || !fields.precioBebida[0]) {
                return res.status(400).json({ error: 'El precio de la bebida es requerido' });
            }
            if (!fields.categoriaBebida || !fields.categoriaBebida[0]) {
                return res.status(400).json({ error: 'La categoría de la bebida es requerida' });
            }
            if (!files.imagen) {
                return res.status(400).json({ error: 'La imagen de la bebida es requerida' });
            }

            // Verificar categoría
            const categoriaId = fields.categoriaBebida[0];
            const categoria = await Categoria.findById(categoriaId);
            if (!categoria) {
                return res.status(404).json({ error: `No se encontró la categoría: ${categoriaId}` });
            }

            // Manejar imagen
            let imagenUrl = '';
            if (files.imagen && files.imagen[0]) {
                const file = files.imagen[0];
                const dirPath = path.join(__dirname, '../assets/uploads');
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }

                const fileName = `bebida_${Date.now()}${path.extname(file.originalFilename || '')}`;
                const newPath = path.join(dirPath, fileName);
                fs.renameSync(file.filepath, newPath);
                imagenUrl = `/assets/uploads/${fileName}`;
            }

            // Crear bebida
            const bebida = new Bebida({
                nombreBebida: fields.nombreBebida[0],
                descripcionBebida: fields.descripcionBebida[0],
                precioBebida: fields.precioBebida[0],
                categoriaBebida: categoriaId,
                estadoBebida: fields.estadoBebida[0] === 'true',
                imagenBebida: imagenUrl
            });

            const bebidaGuardada = await bebida.save();
            res.status(201).json(bebidaGuardada);
        });

    } catch (error) {
        console.error('Error en crearBebida:', error);
        res.status(500).json({ error: 'Error al crear la bebida' });
    }
};

// servicio para obtener todas las bebidas con paginación
exports.obtenerBebidas = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 5;
        const skip = (pagina - 1) * limite;

        const bebidas = await Bebida.find()
            .populate('categoriaBebida', 'nombreCategoria')
            .skip(skip)
            .limit(limite);

        const totalBebidas = await Bebida.countDocuments();
        const totalPaginas = Math.ceil(totalBebidas / limite);

        res.status(200).json({
            bebidas,
            paginaActual: pagina,
            totalPaginas,
            totalBebidas
        });

    } catch (error) {
        console.error("Error en obtenerBebidas:", error);
        res.status(500).json({ error: "Error al obtener bebidas" });
    }
};

// servicio para obtener una bebida por id
exports.obtenerBebidaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const bebida = await Bebida.findById(id);
        if (bebida) {
            res.status(200).send(bebida);
        } else {
            res.status(404).send("Bebida no encontrada");
        }

    } catch (error) {
        console.log("Error en obtenerBebidaPorId: ", error);
        res.status(500).send("Hubo un error en el servidor");
    }
};

// servicio para actualizar una bebida
exports.updateBebida = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            maxFileSize: 10 * 1024 * 1024,
            keepExtensions: true
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: 'Error al procesar el formulario' });
            }

            const { id } = req.params;

            // Validaciones
            if (!fields.nombreBebida || !fields.nombreBebida[0]) {
                return res.status(400).json({ error: 'El nombre de la bebida es requerido' });
            }
            if (!fields.descripcionBebida || !fields.descripcionBebida[0]) {
                return res.status(400).json({ error: 'La descripción de la bebida es requerida' });
            }
            if (!fields.precioBebida || !fields.precioBebida[0]) {
                return res.status(400).json({ error: 'El precio de la bebida es requerido' });
            }
            if (!fields.categoriaBebida || !fields.categoriaBebida[0]) {
                return res.status(400).json({ error: 'La categoría de la bebida es requerida' });
            }

            const bebida = {
                nombreBebida: fields.nombreBebida[0],
                descripcionBebida: fields.descripcionBebida[0],
                precioBebida: fields.precioBebida[0],
                categoriaBebida: fields.categoriaBebida[0],
                estadoBebida: fields.estadoBebida[0] === 'true'
            };

            // Manejar imagen si se proporciona una nueva
            if (files.imagen && files.imagen[0]) {
                const file = files.imagen[0];
                const dirPath = path.join(__dirname, '../assets/uploads');
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }

                const fileName = `bebida_${Date.now()}${path.extname(file.originalFilename || '')}`;
                const newPath = path.join(dirPath, fileName);
                fs.renameSync(file.filepath, newPath);
                bebida.imagenBebida = `/assets/uploads/${fileName}`;
            }

            const bebidaActualizada = await Bebida.findByIdAndUpdate(
                id, 
                bebida, 
                { new: true }
            );

            if (!bebidaActualizada) {
                return res.status(404).json({ error: 'Bebida no encontrada' });
            }

            res.json(bebidaActualizada);
        });
    } catch (error) {
        console.error('Error en updateBebida:', error);
        res.status(500).json({ error: 'Error al actualizar la bebida' });
    }
};

// servicio para eliminar una bebida
exports.eliminarBebida = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminarBebida = await Bebida.findByIdAndDelete(id);

        if (eliminarBebida) {
            res.status(200).send(eliminarBebida);
        } else {
            res.status(404).send("Bebida no encontrada");
        }

    } catch (error) {
        console.log("Error en eliminarBebida: ", error);
        res.status(500).send("Hubo un error en el servidor");
    }
};

