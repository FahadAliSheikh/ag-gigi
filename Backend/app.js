const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/database');
const cors = require('cors');
seedDB = require("./seed");


///////////////////////////////////////////////////////////
mongoose.connect(config.db, {
    //  useMongoClient :true,
    useNewUrlParser: true
}).then(() => {
    console.log('mongoDB is connected...');
})
    .catch((err) => {
        throw err
    });

//seedDB();
//routes
const packageSpecificationRoute = require('./api/routes/package_specification');
const userRoute = require('./api/routes/user');
const companyRoute = require('./api/routes/company');
const buyerRoute = require('./api/routes/buyer');
const concernedRoute = require('./api/routes/concerned_person');
const dropDownRoute = require('./api/routes/dropdowns');
const costingRoute = require('./api/routes/costing');
const estimationRoute = require('./api/routes/estimation');


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', "PUT, POST, PATCH, DELETE, GET");
    next();
});
app.disable('etag');

//routes to handle requests
app.use('/pkg_spec', packageSpecificationRoute);
app.use('/user', userRoute);
app.use('/company', companyRoute);
app.use('/buyer', buyerRoute);
app.use('/concerned', concernedRoute);
app.use('/dropdown', dropDownRoute)
app.use('/costing', costingRoute);
app.use('/estimation', estimationRoute);

//if no route found
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;