import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class PeriodoVacacionView extends Model {
    public idPeriodo?: number | undefined;
    public nombrePeriodo?: string | undefined;

    public fechaInicio?: string | null | undefined;
    public fechaFin?: string | null | undefined;

    public pagada?: boolean | null | undefined;
    public noQuincena?: number | undefined;

    public activo?: boolean | null | undefined;
    public tipo?: number | undefined;

    public codEmpleado?: number | undefined;
}

PeriodoVacacionView.init(
    {
        idPeriodo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        nombrePeriodo: {
            type: DataTypes.STRING(23),
            allowNull: false
        },
        fechaInicio: {
            type: DataTypes.DATE,
            allowNull: true
        },
        fechaFin: {
            type: DataTypes.DATE,
            allowNull: true
        },
        pagada: {
            type: DataTypes.BOOLEAN, // bit en SQL Server
            allowNull: true
        },
        noQuincena: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN, // bit en SQL Server
            allowNull: true
        },
        tipo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        codEmpleado: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize: sequelizeInit('NOMINA'),
        tableName: 'vwPeriodoVacacion',
        timestamps: false
    }
)

export default PeriodoVacacionView