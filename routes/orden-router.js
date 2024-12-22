
import express from 'express';
import { sequelize, QueryTypes } from "../config/db.js";
import authenticate from '../middlewares/authMiddleware.js';

const ordenRouter = express.Router();

ordenRouter.post('/', authenticate ,async (req, res) => {
    const requestBody = req.body;

    const validFields = [
        "usuarios_idusuarios", "estados_idestados", "nombre_completo", 
        "telefono", "correo_electronico", "fecha_entrega", "total_orden", "detalles_orden"
    ];

    const requiredFields = [
        "usuarios_idusuarios", "estados_idestados", "nombre_completo", 
        "telefono", "correo_electronico", "fecha_entrega", "total_orden", "detalles_orden"
    ];


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

    const {
        usuarios_idusuarios, estados_idestados, nombre_completo, 
        telefono, correo_electronico, fecha_entrega, total_orden, detalles_orden
    } = requestBody;

    if (!Array.isArray(detalles_orden) || detalles_orden.length === 0) {
        return res.status(400).json({
            message: "El campo 'detalles_orden' debe ser un arreglo con al menos un elemento."
        });
    }

    const detallesRequiredFields = ["Orden_idProductos", "cantidad", "precio", "subtotal"];
    const detallesInvalid = detalles_orden.map((detalle, index) => {
        const missingFields = detallesRequiredFields.filter(field => !(field in detalle));
        return missingFields.length > 0 ? { index, missingFields } : null;
    }).filter(Boolean);

    if (detallesInvalid.length > 0) {
        return res.status(400).json({
            message: "Algunos detalles de la orden tienen campos faltantes.",
            detallesInvalidos: detallesInvalid
        });
    }

    try {
        const fechaEntregaFormatted = new Date().toISOString().slice(0, 10).replace('T', ' ')

        await sequelize.query(
            `EXEC InsertarOrden
            @usuarios_idusuarios = :usuarios_idusuarios,
            @estados_idestados = :estados_idestados,
            @fecha_creacion = :fecha_creacion, 
            @nombre_completo = :nombre_completo, 
            @telefono = :telefono, 
            @correo_electronico = :correo_electronico, 
            @fecha_entrega = :fecha_entrega, 
            @total_orden = :total_orden,
            @detalles_orden = :detalles_orden`,
            {
                replacements: { 
                    usuarios_idusuarios, 
                    estados_idestados, 
                    fecha_creacion : fechaEntregaFormatted, 
                    nombre_completo, 
                    telefono, 
                    correo_electronico, 
                    fecha_entrega, 
                    total_orden, 
                    detalles_orden: JSON.stringify(detalles_orden) 
                },
                type: QueryTypes.RAW,
            }
        );

        res.status(200).json({ message: 'Orden insertada correctamente' });
    } catch (err) {
        console.error('Error al insertar la orden:', err);
        res.status(500).json({ message: 'Error al insertar la orden' });
    }
});




ordenRouter.put("/:idOrden", authenticate ,async (req, res) => {
    const { idOrden } = req.params;
    const requestBody = req.body;

    const validFields = [
        "usuarios_idusuarios", "estados_idestados", "nombre_completo", 
        "telefono", "correo_electronico", "fecha_entrega", "total_orden", "detalles_orden"
    ];

    const requiredFields = [
        "usuarios_idusuarios", "estados_idestados", "nombre_completo", 
        "telefono", "correo_electronico", "fecha_entrega", "total_orden", "detalles_orden"
    ];

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

    const {
        usuarios_idusuarios, estados_idestados, nombre_completo, 
        telefono, correo_electronico, fecha_entrega, total_orden, detalles_orden
    } = requestBody;

    if (!Array.isArray(detalles_orden) || detalles_orden.length === 0) {
        return res.status(400).json({
            message: "El campo 'detalles_orden' debe ser un arreglo con al menos un elemento."
        });
    }

    const detallesRequiredFields = ["Orden_idProductos", "cantidad", "precio", "subtotal"];
    const detallesInvalid = detalles_orden.map((detalle, index) => {
        const missingFields = detallesRequiredFields.filter(field => !(field in detalle));
        return missingFields.length > 0 ? { index, missingFields } : null;
    }).filter(Boolean);

    if (detallesInvalid.length > 0) {
        return res.status(400).json({
            message: "Algunos detalles de la orden tienen campos faltantes.",
            detallesInvalidos: detallesInvalid
        });
    }

    try {
        const [ordenExistente] = await sequelize.query(
            `SELECT COUNT(*) AS existe FROM Orden WHERE idOrden = :idOrden`,
            {
                replacements: { idOrden },
                type: QueryTypes.SELECT,
            }
        );

        if (!ordenExistente.existe) {
            return res.status(404).json({ message: "Orden no encontrada." });
        }

        // Actualizar la orden
        await sequelize.query(
            `EXEC ActualizarOrden 
                @idOrden = :idOrden,
                @usuarios_idusuarios = :usuarios_idusuarios,
                @estados_idestados = :estados_idestados,
                @nombre_completo = :nombre_completo,
                @telefono = :telefono,
                @correo_electronico = :correo_electronico,
                @fecha_entrega = :fecha_entrega,
                @total_orden = :total_orden,
                @detalles_orden = :detalles_orden`,
            {
                replacements: {
                    idOrden,
                    usuarios_idusuarios,
                    estados_idestados,
                    nombre_completo,
                    telefono,
                    correo_electronico,
                    fecha_entrega,
                    total_orden,
                    detalles_orden: JSON.stringify(detalles_orden),
                },
                type: QueryTypes.RAW,
            }
        );

        res.status(200).json({ message: "Orden actualizada correctamente." });
    } catch (err) {
        console.error("Error al actualizar la orden:", err);
        res.status(500).json({ message: "Error al actualizar la orden." });
    }
});

export default ordenRouter;
