import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";
import TipoPersonasConvivioModel from "./TipoPersonasConvivioModel";

class PersonasConvivioModel extends Model {
    public id_personas_convivio!: number;
    public codigo!: number;
    public id_tipo_persona_convivio!: number;
    public nombre_persona_convivio!: string | null;
    public empresa!: string | null;
    public userCreatedAt!: number | null;
    public userUpdatedAt!: number | null;
    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

PersonasConvivioModel.init(
    {
        id_personas_convivio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        codigo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_tipo_persona_convivio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nombre_persona_convivio: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        empresa: {
            type: DataTypes.STRING(500),
            allowNull: true
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
        tableName: "personas_convivio",
        schema: "app",
        timestamps: true
    }
)

PersonasConvivioModel.belongsTo(TipoPersonasConvivioModel, {
    foreignKey: 'id_tipo_persona_convivio'
})

export default PersonasConvivioModel