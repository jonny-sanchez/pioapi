import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class TipoBoletaModel extends Model {
    public id_tipo_boleta!: number;
    public name!: string;
    public userCreatedAt!: number | null;
    public userUpdatedAt!: number | null;
    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

TipoBoletaModel.init(
    {
        id_tipo_boleta: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: { 
            type: DataTypes.STRING(500),
            allowNull: false
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
        tableName: 'tipo_boleta',
        schema: 'app',
        timestamps: true
    }
)

export default TipoBoletaModel