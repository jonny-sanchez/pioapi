import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class TipoPersonasConvivioModel extends Model{
    public id_tipo_persona_convivio!: number;
    public name_tipo_persona_convivio!: string;
    public userCreatedAt!: number | null;
    public userUpdatedAt!: number | null;
    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

TipoPersonasConvivioModel.init(
    {
        id_tipo_persona_convivio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name_tipo_persona_convivio: {
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
        tableName: "tipo_persona_convivio",
        schema: "app",
        timestamps: true
    }
)

export default TipoPersonasConvivioModel
