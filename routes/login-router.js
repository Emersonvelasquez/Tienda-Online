import express from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../Auth/auth.js';
import { query, QueryTypes } from '../config/db.js';

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
    const { nombre_completo, password } = req.body;
    console.log(nombre_completo)
    console.log(typeof(password))

    try {
        if (!nombre_completo || !password) {
            return res.status(400).json({ message: 'Faltan datos: nombre completo o contraseña' });
        }

        const user = await query(
            `SELECT * FROM Usuarios WHERE nombre_completo = :nombre_completo`,
            { replacements: { nombre_completo }, type: QueryTypes.SELECT }
        );
            console.log(user[0].password)
        if (user.length === 0) {
            return res.status(401).json({ message: 'Usuario incorrecto' });
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password)
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = generateToken(user[0]);

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });

    } catch (err) {
        console.error('Error durante el inicio de sesión:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default loginRouter;
