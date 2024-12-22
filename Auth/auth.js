import jwt from 'jsonwebtoken';

export const SECRET_KEY = 'your_secret_key';

export function generateToken(user) {
    return jwt.sign(
        { id: user.id, nombre_completo: user.nombre_completo },
        SECRET_KEY,
        { expiresIn: '24h' } 
    );
}
