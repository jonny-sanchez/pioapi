import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class RolModel extends Model {
    public id_rol!: number;
    public name!: string;
    public userCreatedAt!: string;
    public userUpdatedAt!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

RolModel.init(
    {
        id_rol: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        name: { type: DataTypes.STRING(250), allowNull: false },
        userCreatedAt: { type: DataTypes.BIGINT, allowNull: true },
        userUpdatedAt: { type: DataTypes.BIGINT, allowNull: true }
    },
    {
        sequelize: sequelizeInit('PIOAPP'),
        tableName: 'rol',
        schema: 'app',
        timestamps: true
    }
)

export default RolModel