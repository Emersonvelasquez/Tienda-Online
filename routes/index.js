import categoriaproductoRouter from "./categoriaproducto-router.js";
import clienteRouter from "./clientes-router.js";
import estadosRouter from "./estados-router.js";
import loginRouter from "./login-router.js";
import logoutRouter from "./logout-router.js";
import ordenRouter from "./orden-router.js";
import productosRouter from "./productos-router.js";
import rolRouter from "./rol-router.js";
import usuariosRouter from "./usuarios-route.js";
const RouterApi = (app) => {
app.use('/cliente', clienteRouter);
app.use('/producto' , productosRouter)
app.use('/estado' , estadosRouter)
app.use('/rol' , rolRouter)
app.use('/usuarios' , usuariosRouter)
app.use('/categoria' , categoriaproductoRouter)
app.use('/orden' , ordenRouter )
app.use('/login' , loginRouter  )
app.use('/logout' , logoutRouter  )
};

export default RouterApi;
