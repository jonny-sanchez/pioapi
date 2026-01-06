import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";


class UsersModel extends Model {
    public id_users!: bigint;
    public codigo_user?: string;
    public id_rol!: number;
    public first_name!: string;
    public second_name!: string;
    public first_last_name!: string;
    public second_last_name!: string;
    public email?: string;
    public password!: string;
    public dpi?: string;
    public fecha_nacimiento?: Date;
    public direccion?: string;
    public puesto_trabajo?: string;
    public userCreatedAt!: string;
    public userUpdatedAt!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public baja?: boolean;
}

UsersModel.init(
    {
        id_users: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false },
        codigo_user: { type: DataTypes.STRING(100), allowNull: false },
        id_rol: { type: DataTypes.INTEGER, allowNull: false },
        first_name: { type: DataTypes.STRING(500), allowNull: false },
        second_name: { type: DataTypes.STRING(500), allowNull: true },
        first_last_name: { type: DataTypes.STRING(500), allowNull: true },
        second_last_name: { type: DataTypes.STRING(500), allowNull: true },
        email: { type: DataTypes.STRING(500), allowNull: true },
        password: { type: DataTypes.TEXT, allowNull: false },
        dpi: { type: DataTypes.TEXT, allowNull: true },
        fecha_nacimiento: { type: DataTypes.DATE, allowNull: true }, 
        direccion: { type: DataTypes.STRING(500), allowNull: true },
        puesto_trabajo: { type: DataTypes.STRING(500), allowNull: true },
        userCreatedAt: { type: DataTypes.BIGINT, allowNull: true },
        userUpdatedAt: { type: DataTypes.BIGINT, allowNull: true },
        baja: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    },
    {
        sequelize: sequelizeInit('PIOAPP'),
        tableName: 'users',
        schema: 'app',
        timestamps: true
    }
)

export default UsersModel