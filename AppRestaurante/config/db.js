const mongoose = require('mongoose');

// realizar la conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/AppRestaurante')
    .then(() => { // si la conexion es exitosa
        console.log('Conexion a la base de datos exitosa'); // se imprime un mensaje en la consola
    })
    .catch((err) => { // si hay un error en la conexion
        console.log('Error en la conexion a la base de datos: ', err); // se imprime el error en la consola
    });