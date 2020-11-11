const express = require('express')
const product = require('./routs/rout')

const bodyParser = require('body-parser');

const app = express()

const mongoose = require('mongoose')
const uri = 'mongodb+srv://admin:admin@cluster0.w41p4.mongodb.net/Todos';

mongoose.connect(uri, {useNewUrlParser: true,  useUnifiedTopology: true })

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/products', product)

let port = 1234;

app.listen(port, () => {console.log('Server is up and running on port number ' + port);});


