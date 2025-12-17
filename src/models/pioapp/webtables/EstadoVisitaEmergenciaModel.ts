import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class EstadoVisitaEmergenciaModel extends Model {
    public id_estado!: number;
    public nombre!: string;
    public descripcion!: string | null;
}

EstadoVisitaEmergenciaModel.init(
    {
        id_estado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize: sequelizeInit('PIOAPP'),
        tableName: "tbl_estado_visita_emergencia",
        schema: "web",
        timestamps: false
    }
)

export default EstadoVisitaEmergenciaModel