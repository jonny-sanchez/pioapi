import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class TipoVisitaModel extends Model {
    public id_tipo_visita!: number;
    public name!: string;
    public userCreatedAt!: number | null;
    public userUpdatedAt!: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

TipoVisitaModel.init(
    {
        id_tipo_visita: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        userCreatedAt: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        userUpdatedAt: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
    },
    {
        sequelize: sequelizeInit('PIOAPP'),
        tableName: 'tipo_visita',
        schema: 'app',
        timestamps: true
    }
)

export default TipoVisitaModel