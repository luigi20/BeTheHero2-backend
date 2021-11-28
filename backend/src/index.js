require("dotenv").config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const app = express();

app.use(cors());
/*
    Tipos de parametros
    Query Param : Parametros nomeados enviados na rota após "?"
    Route Param : Utilizados para identificar recursos
    Request Body : Utilizado para criar ou alterar recursos
*/

app.use(express.json());
app.use(routes);



app.listen(process.env.PORT || 3333);