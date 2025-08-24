// Routes
const indexRouter = require('./index');
const homeRouter = require('./home');
const clientRouter = require('./clients');
const userRouter = require('./users');


//Use Routers
const routerHandler = (app) => {
    app.use('/', indexRouter);
    app.use('/h', homeRouter);
    app.use('/clients', clientRouter);
    app.use('/users', userRouter);
}


module.exports = routerHandler;