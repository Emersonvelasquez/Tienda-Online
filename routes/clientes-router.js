
import express from 'express';
import { sequelize, QueryTypes } from "../config/db.js";
import authenticate from '../middlewares/authMiddleware.js';

const clienteRouter = express.Router();

const validFields = ['razon_social', 'nombre_comercial', 'direccion_entrega', 'telefono', 'email'];
const requiredFields = ['razon_social', 'nombre_comercial', 'direccion_entrega', 'telefono', 'email'];

clienteRouter.post('/', authenticate ,async (req, res) => {
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

const { razon_social, nombre_comercial, direccion_entrega, telefono, email } = requestBody;

try {
    const result = await sequelize.query(
    'EXEC InsertarCliente @razon_social = :razon_social, @nombre_comercial = :nombre_comercial, @direccion_entrega = :direccion_entrega, @telefono = :telefono, @email = :email',
    {
        replacements: { razon_social, nombre_comercial, direccion_entrega, telefono, email },
        type: QueryTypes.RAW,
    }
    );

    res.status(200).json({ message: 'Cliente insertado correctamente' });
} catch (err) {
    console.error('Error al insertar el cliente:', err);
    res.status(500).json({ message: 'Error al insertar el cliente' });
}
});



clienteRouter.put("/:idCliente", authenticate ,async (req, res) => {
    const requestBody = req.body;
    const { idCliente } = req.params;

    const requiredFields = ["razon_social", "nombre_comercial", "direccion_entrega" , "telefono" , "email"];
    const missingFields = requiredFields.filter((field) => !(field in requestBody));


    const validFields = ["razon_social", "nombre_comercial", "direccion_entrega" , "telefono" , "email"];
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

    const { razon_social, nombre_comercial, direccion_entrega , telefono , email } = requestBody;

    try {
    const result = await sequelize.query(
        `EXEC ActualizarCliente
        @idCliente = :idCliente,
        @razon_social = :razon_social,
        @nombre_comercial = :nombre_comercial,
        @direccion_entrega = :direccion_entrega,
        @telefono = :telefono,
        @email = :email`,
        {
        replacements: {
            idCliente,
            razon_social,
            nombre_comercial,
            direccion_entrega,
            telefono,
            email,
        },
        type: QueryTypes.RAW,
        }
    );

    if (result[1] === 0) {
        return res.status(404).json({ message: "Cliente no encontrado." });
    }

    res.status(200).json({ message: "Cliente actualizado correctamente." });
    } catch (err) {
    console.error("Error al actualizar el cliente:", err);
    res.status(500).json({ message: "Error al actualizar el cliente." });
    }
});

export default clienteRouter;
