const createData = async (users, turns) => {
    try {
        // Sincroniza los modelos sin forzar la recreación de tablas
        await users.sync();
        await turns.sync();

        // Insertamos datos en cada tabla
        await users.bulkCreate([
            { Nombre: 'admin', Contrasena: 'admin' },
        ]);

        // await turns.bulkCreate([
        //     { Nombre: 'Paola', Telefono: '3519999999', Fecha:'1111-11-11', Horario: '11:11:11', NroUsuario: 1},
        //     { Nombre: 'Javier', Telefono: '3511111111', Fecha:'1111-11-11', Horario: '11:11:11', NroUsuario: 2},
        // ]);

    } catch (error) {
        console.error("Error al insertar datos:", error);
    }
}

export default createData;
