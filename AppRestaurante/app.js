const initRoles = require('./config/initRoles');
const express = require('express');
const cors = require('cors');
const bd = require('./config/db');
const path = require('path');

const ProductosRoute = require('./routes/ProductosRoute');
const BebidasRoute = require('./routes/BebidasRoute');
const CategoriasRoute = require('./routes/CategoriasRoute');
const AuthRoute = require('./routes/AuthRoute');

const app = express();

// Configurar CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500', // URL frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
initRoles();
ProductosRoute(app);
BebidasRoute(app);
CategoriasRoute(app);
AuthRoute(app);

app.listen(3001, () => {
    console.log('Servidor corriendo en el puerto 3001');
}); 