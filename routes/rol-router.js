
import express from 'express';
import { sequelize, QueryTypes } from "../config/db.js";
import authenticate from '../middlewares/authMiddleware.js';

const rolRouter = express.Router();

const validFields = ['nombre'];
const requiredFields = ['nombre'];

rolRouter.post('/', authenticate ,async (req, res) => {
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
    'EXEC InsertarRol  @nombre = :nombre',
    {
        replacements: { nombre },
        type: QueryTypes.RAW,
    }
    );

    res.status(200).json({ message: 'rol insertado correctamente' });
} catch (err) {
    console.error('Error al insertar el rol:', err);
    res.status(500).json({ message: 'Error al insertar el rol' });
}
});



rolRouter.put("/:idrol", authenticate ,async (req, res) => {
    const { idrol } = req.params;
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
        `EXEC ActualizarRol
        @idrol = :idrol,
        @nombre = :nombre`,
        {
        replacements: {
            idrol,
            nombre,
        },
        type: QueryTypes.RAW,
        }
    );

    if (result[1] === 0) {
        return res.status(404).json({ message: "rol no encontrado." });
    }

    res.status(200).json({ message: "rol actualizado correctamente." });
    } catch (err) {
    console.error("Error al actualizar el rol:", err);
    res.status(500).json({ message: "Error al actualizar el rol." });
    }
});

export default rolRouter;
