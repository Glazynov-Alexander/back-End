const express = require('express')
const mongoose = require('mongoose')
const product = require('./routes/task.route')
const auth = require('./routes/auth.route')



const bodyParser = require('body-parser');
const {dbUrl} = require('./default.json');


const app = express()



mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use('/lists', product)
app.use('/', auth)
let port = 1234;

app.listen(port, () => console.log('Server is up and running on port number ' + port));


