
import express from 'express';
import { sequelize, QueryTypes } from "../config/db.js";
import authenticate from '../middlewares/authMiddleware.js';

const categoriaproductoRouter = express.Router();

const validFields = ['usuarios_idusuarios', 'nombre', 'estados_idestados', ];
const requiredFields = ['usuarios_idusuarios', 'nombre', 'estados_idestados'];

categoriaproductoRouter.post('/', authenticate, async (req, res) => {
    const requestBody = req.body;

    const invalidFields = Object.keys(requestBody).filter(field => !validFields.includes(field));

    if (invalidFields.length > 0) {
        return res.status(400).json({
            message: `Campos inválidos: ${invalidFields.join(', ')}.`
        });
    }

    const missingFields = requiredFields.filter(field => !Object.keys(requestBody).includes(field));
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Faltan campos requeridos: ${missingFields.join(', ')}.`
        });
    }

    const { usuarios_idusuarios, nombre, estados_idestados, fecha_creacion } = requestBody;

    try {
        
        const fechaEntregaFormatted = new Date().toISOString().slice(0, 10).replace('T', ' ')

        const result = await sequelize.query(
            'EXEC InsertarCategoriaProducto @usuarios_idusuarios = :usuarios_idusuarios, @nombre = :nombre, @estados_idestados = :estados_idestados, @fecha_creacion = :fecha_creacion',
            {
                replacements: { usuarios_idusuarios,
                    nombre, estados_idestados, 
                    fecha_creacion : fechaEntregaFormatted },
                type: QueryTypes.RAW,
            }
        );
        res.status(200).json({ message: 'Categoriaproducto insertado correctamente' });
    } catch (err) {
        console.error('Error al insertar el categoriaproducto:', err);
        res.status(500).json({ message: 'Error al insertar el categoriaproducto' });
    }
});




categoriaproductoRouter.put("/:idCategoriaProductos", authenticate,async (req, res) => {
    const requestBody = req.body;
    const { idCategoriaProductos } = req.params;

    const requiredFields = ["usuarios_idusuarios", "nombre", "estados_idestados"];
    const missingFields = requiredFields.filter((field) => !(field in requestBody));


    const validFields = ["usuarios_idusuarios", "nombre", "estados_idestados"];
    const invalidFields = Object.keys(requestBody).filter(
    (field) => !validFields.includes(field)
    );

    if (invalidFields.length > 0) {
    return res.status(400).json({
        message: `Campos inválidos: ${invalidFields.join(", ")}.`,
    });
    }

    if (missingFields.length > 0) {
    return res.status(400).json({
        message: `Faltan campos requeridos: ${missingFields.join(", ")}.`,
    });
    }

    const { usuarios_idusuarios, nombre, estados_idestados } = requestBody;

    try {
    const result = await sequelize.query(
        `EXEC ActualizarCategoriaProducto
        @idCategoriaProductos = :idCategoriaProductos,
        @usuarios_idusuarios = :usuarios_idusuarios,
        @nombre = :nombre,
        @estados_idestados = :estados_idestados`,
        {
        replacements: {
            idCategoriaProductos,
            usuarios_idusuarios,
            nombre,
            estados_idestados,
        },
        type: QueryTypes.RAW,
        }
    );

    if (result[1] === 0) {
        return res.status(404).json({ message: "Categoriaproducto no encontrado." });
    }

    res.status(200).json({ message: "Categoriaproducto actualizado correctamente." });
    } catch (err) {
    console.error("Error al actualizar el categoriaproducto:", err);
    res.status(500).json({ message: "Error al actualizar el categoriaproducto." });
    }
});

export default categoriaproductoRouter;
