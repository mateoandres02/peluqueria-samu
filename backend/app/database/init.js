const createData = async (users) => {
    try {
        // Sincroniza los modelos sin forzar la recreación de tablas
        await users.sync();

        // Insertamos datos en cada tabla
        await users.bulkCreate([
            { Nombre: 'admin', Contrasena: 'admin' },
        ]);

    } catch (error) {
        console.error("Error al insertar datos:", error);
    }
}

export default createData;
