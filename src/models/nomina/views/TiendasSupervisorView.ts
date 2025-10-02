import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class TiendasSupervisorView extends Model {
    public idResponsableCentroCosto?: number;
    public codEmpleado?: number;
    public empresa?: string;
    public tienda?: string;
    public tda_nombre?: string;
    public direccion?: string;
}

TiendasSupervisorView.init(
    {
        idResponsableCentroCosto: { 
            type: DataTypes.INTEGER, 
            primaryKey: true,
            allowNull: false 
        },
        codEmpleado: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        empresa: {
            type: DataTypes.STRING(6),
            allowNull: false
        },
        tienda: {
            type: DataTypes.STRING(6),
            allowNull: false
        },
        tda_nombre: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        direccion: {
            type: DataTypes.STRING(512),
            allowNull: false
        }
    },
    {
        sequelize: sequelizeInit('NOMINA'),
        tableName: 'vwTiendasSupervisor',
        timestamps: false
    }
)

export default TiendasSupervisorView