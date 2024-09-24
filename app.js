require('dotenv').config();

const cors = require('cors');
const express = require('express');
const apiRouter = require('./api/router');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', apiRouter);

app.listen(5000, () => {
    console.log('Server is up and running.');
});