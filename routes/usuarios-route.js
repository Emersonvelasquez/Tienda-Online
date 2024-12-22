
import express from 'express';
import { sequelize, QueryTypes } from "../config/db.js";
import bcrypt from "bcrypt";
const usuariosRouter = express.Router();

const validFields = [
    'rol_id', 
    'estados_idestados', 
    'correo_electronico', 
    'nombre_completo', 
    'password', 
    'telefono',  
    'fecha_nacimiento', 
    'Clientes_idClientes'
];

const requiredFields = [
    'rol_id', 
    'estados_idestados', 
    'correo_electronico', 
    'nombre_completo', 
    'password', 
    'telefono', 
    'fecha_nacimiento', 
    'Clientes_idClientes'
];

usuariosRouter.post("/", async (req, res) => {
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

    const {
        rol_id,
        estados_idestados,
        correo_electronico,
        nombre_completo,
        password,
        telefono,
        fecha_nacimiento,
        Clientes_idClientes
    } = requestBody;

    try {
        const hashedPassword = await bcrypt.hash(password, 8);


        const fechaCreacionFormatted = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const result = await sequelize.query(
            `EXEC InsertarUsuario 
                @rol_id = :rol_id,
                @estados_idestados = :estados_idestados,
                @correo_electronico = :correo_electronico,
                @nombre_completo = :nombre_completo,
                @password = :password,
                @telefono = :telefono,
                @fecha_creacion = :fecha_creacion,
                @fecha_nacimiento = :fecha_nacimiento,
                @Clientes_idClientes = :Clientes_idClientes`,
            {
                replacements: {
                    rol_id,
                    estados_idestados,
                    correo_electronico,
                    nombre_completo,
                    password: hashedPassword,
                    telefono,
                    fecha_creacion: fechaCreacionFormatted,
                    fecha_nacimiento,
                    Clientes_idClientes
                },
                type: QueryTypes.RAW
            }
        );

        res.status(201).json({
            message: "Usuario insertado correctamente"
        });
    } catch (error) {
        console.error("Error al insertar el usuario:", error);

        if (error.original && error.original.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                message: "El correo electrónico ya está en uso."
            });
        }

        res.status(500).json({
            message: "Error al insertar el usuario",
            error: error.message
        });
    }
});


usuariosRouter.put('/:idusuarios' , async (req, res) => {
    const requestBody = req.body;
    const { idusuarios } = req.params;

    const requiredFields = [ "rol_id",
        "estados_idestados",
        "correo_electronico",
        "nombre_completo",
        "password",
        "telefono",
        "fecha_nacimiento",
        "Clientes_idClientes"];
    const missingFields = requiredFields.filter((field) => !(field in requestBody));


    const validFields = [ "rol_id",
    "estados_idestados",
    "correo_electronico",
    "nombre_completo",
    "password",
    "telefono",
    "fecha_nacimiento",
    "Clientes_idClientes"];
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

    const {
    rol_id,
    estados_idestados,
    correo_electronico,
    nombre_completo,
    password,
    telefono,
    fecha_nacimiento,
    Clientes_idClientes,
    } = requestBody;

    try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sequelize.query(
        `EXEC ActualizarUsuario 
            @idusuarios = :idusuarios,
            @rol_id = :rol_id,
            @estados_idestados = :estados_idestados,
            @correo_electronico = :correo_electronico,
            @nombre_completo = :nombre_completo,
            @password = :password,
            @telefono = :telefono,
            @fecha_nacimiento = :fecha_nacimiento,
            @Clientes_idClientes = :Clientes_idClientes`,
        {
        replacements: {
            idusuarios,
            rol_id,
            estados_idestados,
            correo_electronico,
            nombre_completo,
            password: hashedPassword,
            telefono,
            fecha_nacimiento,
            Clientes_idClientes,
        },
        type: QueryTypes.RAW,
        }
    );

    if (result[1] === 0) {
        return res.status(404).json({ message: "Usuarios no encontrado." });
    }

    res.status(200).json({ message: "Usuarios actualizado correctamente." });
    } catch (err) {
    console.error("Error al actualizar el usuarios:", err);
    res.status(500).json({ message: "Error al actualizar el usuarios." });
    }
});

export default usuariosRouter;
