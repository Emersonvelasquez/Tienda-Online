import { expressjwt as jwt } from 'express-jwt';
import { SECRET_KEY } from '../Auth/auth.js';

const authenticate = jwt({
    secret: SECRET_KEY,
    algorithms: ['HS256'],
    requestProperty: 'auth',
    getToken: (req) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') 
        {
            return req.headers.authorization.split(' ')[1];
        }else{
            return null;
        }
        
    },
});

export default authenticate;
