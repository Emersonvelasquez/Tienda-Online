
import express from 'express';
const logoutRouter = express.Router();

logoutRouter.post('/', (req, res) => {
    res.status(200).json({ message: 'Cierre de sesión exitoso' });
});



export default logoutRouter;
