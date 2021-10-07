const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const mainRoutes = require('./src/route/main');
const keyResource = require('./src/utils/key_resource');
const status = require('./src/utils/status');

const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(logger('dev'));

mongoose.connect(keyResource.uriDB, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Database connected')
    })
    .catch((error) => {
        console.log(error);
        console.log('Error connecting to database')
    });

app.get('/', function (req, res) {
    if (!res.headersSent) {
        res.status(status.success).json({
            message: 'TECH NFD API RESTFUL',
        });
    }
    res.end();
});

app.use('/api/', mainRoutes);

app.listen(app.get('port'), function () {
    console.log('Listening on port ' + app.get('port'));
});
