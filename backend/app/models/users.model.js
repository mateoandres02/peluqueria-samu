import { DataTypes } from "sequelize";

const usersAttributes = {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoincrement: true,

        // Podemos generar una id hasheada con sequelize.
        // type: DataTypes.UUID,
        // defaultValue: UUIDV4,
        // primaryKey: true,

    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Rol: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Empleado'
    }
};

const usersOptions = {
    timestamps: false
}

const usersModel = {
    usersAttributes,
    usersOptions
}

export default usersModel;