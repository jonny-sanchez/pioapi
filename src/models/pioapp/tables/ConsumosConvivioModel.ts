import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class ConsumosConvivioModel extends Model {
    public id_consumos_convivio!: number;
    public id_personas_convivio!: number;
    public id_productos_convivio!: number;
    public cantidad!: number;
    public userCreatedAt!: number | null;
    public userUpdatedAt!: number | null;
    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

ConsumosConvivioModel.init(
    {
        id_consumos_convivio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_personas_convivio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_productos_convivio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        userCreatedAt: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        userUpdatedAt: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    },
    {
        sequelize: sequelizeInit('PIOAPP'),
        tableName: "consumos_convivio",
        schema: "app",
        timestamps: true
    }
)

export default ConsumosConvivioModel