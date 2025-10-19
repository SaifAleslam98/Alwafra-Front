// Routes
const indexRouter = require('./index');
const homeRouter = require('./home');
const clientRouter = require('./clients');
const userRouter = require('./users');
const permitRouter = require('./permits');
const financeRouter = require('./finance');

//Use Routers
const routerHandler = (app) => {
    app.use('/', indexRouter);
    app.use('/h', homeRouter);
    app.use('/clients', clientRouter);
    app.use('/users', userRouter);
    app.use('/permits', permitRouter);
    app.use('/finance', financeRouter);
}


module.exports = routerHandler;