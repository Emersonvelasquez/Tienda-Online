
import express from 'express';
import { sequelize, QueryTypes } from "../config/db.js";
import authenticate from '../middlewares/authMiddleware.js';

const estadosRouter = express.Router();

const validFields = ['nombre'];
const requiredFields = ['nombre'];

estadosRouter.post('/', authenticate ,async (req, res) => {
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

const { nombre } = requestBody;

try {
    const result = await sequelize.query(
    'EXEC InsertarEstado  @nombre = :nombre',
    {
        replacements: { nombre },
        type: QueryTypes.RAW,
    }
    );

    res.status(200).json({ message: 'estado insertado correctamente' });
} catch (err) {
    console.error('Error al insertar el estado:', err);
    res.status(500).json({ message: 'Error al insertar el estado' });
}
});



estadosRouter.put("/:idestados", authenticate ,async (req, res) => {
    const { idestados } = req.params;
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

const { nombre } = requestBody;

    try {
    const result = await sequelize.query(
        `EXEC ActualizarEstado
        @idestados = :idestados,
        @nombre = :nombre`,
        {
        replacements: {
            idestados,
            nombre,
        },
        type: QueryTypes.RAW,
        }
    );

    if (result[1] === 0) {
        return res.status(404).json({ message: "estado no encontrado." });
    }

    res.status(200).json({ message: "estado actualizado correctamente." });
    } catch (err) {
    console.error("Error al actualizar el estado:", err);
    res.status(500).json({ message: "Error al actualizar el estado." });
    }
});

export default estadosRouter;
