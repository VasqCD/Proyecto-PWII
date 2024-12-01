
const Bebida = require('../models/BebidasModel');

// servicio para crear una bebida
exports.crearBebida = async (req, res) => {
    try {
        let pNombre = req.body.nombreBebida;
        let pDescripcion = req.body.descripcionBebida;
        let pPrecio = req.body.precioBebida;
        let pCategoria = req.body.categoriaBebida;
        let pEstado = req.body.estadoBebida;

        let bebida = new Bebida({
            nombreBebida: pNombre,
            descripcionBebida: pDescripcion,
            precioBebida: pPrecio,
            categoriaBebida: pCategoria,
            estadoBebida: pEstado
        });

        // validar que se llenen todos los campos
        if (!pNombre) {
            return res.status(400).send("El nombre de la bebida es obligatorio");
        }
        if (!pDescripcion) {
            return res.status(400).send("La descripcion de la bebida es obligatoria");
        }
        if (!pPrecio) {
            return res.status(400).send("El precio de la bebida es obligatorio");
        }
        if (!pCategoria) {
            return res.status(400).send("La categoria de la bebida es obligatoria");
        }
        if (pEstado === undefined) {
            return res.status(400).send("El estado de la bebida es obligatorio");

        }

        // guardar la bebida en la base de datos
        const bebidaGuardada = await bebida.save();
        res.status(201).send(bebidaGuardada);

    } catch (error) {
        console.log("Error en crearBebida: ", error);
        res.status(500).send("Hubo un error en el servidor");
    }
};

// servicio para obtener todas las bebidas con paginación
exports.obtenerBebidas = async (req, res) => {
    try {
        // Obtener el número de página y límite de la query
        const pagina = parseInt(req.query.pagina) || 1; // Si no se especifica, primera página
        const limite = parseInt(req.query.limite) || 5; 

        // Calcular el número de documentos a saltar
        const skip = (pagina - 1) * limite;

        // Obtener bebidas con paginación
        const bebidas = await Bebida.find()
            .skip(skip)
            .limit(limite);

        // Obtener el total de bebidas para calcular el total de páginas
        const totalBebidas = await Bebida.countDocuments();
        const totalPaginas = Math.ceil(totalBebidas / limite);

        res.status(200).json({
            bebidas,
            "Pagina": pagina,
            "De": totalPaginas,
            "Total bebidas": totalBebidas
        });

    } catch (error) {
        console.log("Error en obtenerBebidas: ", error);
        res.status(500).send("Hubo un error en el servidor");
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
        const { id } = req.params;

        let pNombre = req.body.nombreBebida;
        let pDescripcion = req.body.descripcionBebida;
        let pPrecio = req.body.precioBebida;
        let pCategoria = req.body.categoriaBebida;
        let pEstado = req.body.estadoBebida;

        if (!pNombre) {
            return res.status(400).send("El nombre de la bebida es obligatorio");
        }
        if (!pDescripcion) {
            return res.status(400).send("La descripcion de la bebida es obligatoria");
        }
        if (!pPrecio) {
            return res.status(400).send("El precio de la bebida es obligatorio");
        }
        if (!pCategoria) {
            return res.status(400).send("La categoria de la bebida es obligatoria");
        }
        if (pEstado === undefined) {
            return res.status(400).send("El estado de la bebida es obligatorio");

        }

        const bebida = {
            nombreBebida: pNombre,
            descripcionBebida: pDescripcion,
            precioBebida: pPrecio,
            categoriaBebida: pCategoria,
            estadoBebida: pEstado
        }

        const bebidaActualizada = await Bebida.findByIdAndUpdate(id, bebida, { new: true });

        if (bebidaActualizada) {
            res.status(200).send(bebidaActualizada);
        } else {
            res.status(404).send("Bebida no encontrada");
        }

    } catch (error) {
        console.log("Error en updateBebida: ", error);
        res.status(500).send("Hubo un error en el servidor");
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

