const Rols = require('../models/rols');

const initRoles = async () => {

    try {
        const count = await Rols.estimatedDocumentCount();
       
        if(count === 0){
            const values = await Promise.all([
                new Rols({nombre: "user", descripcion: "Usuario normal"}).save(),
                new Rols({nombre: "gerente", descripcion: "Moderador"}).save(),
                new Rols({nombre: "admin", descripcion: "Administrador"}).save()
            ]);
            console.log(values);
            console.log('Roles creados');

        }

    }catch(error){
        console.error('error al crear los roles', error);

    }
};

module.exports = initRoles;