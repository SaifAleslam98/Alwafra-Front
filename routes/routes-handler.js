// Routes
const indexRouter = require('./index');
const homeRouter = require('./home');
const clientRouter = require('./clients');
const userRouter = require('./users');
const permitRouter = require('./permits');


//Use Routers
const routerHandler = (app) => {
    app.use('/', indexRouter);
    app.use('/h', homeRouter);
    app.use('/clients', clientRouter);
    app.use('/users', userRouter);
    app.use('/permits', permitRouter);
}


module.exports = routerHandler;