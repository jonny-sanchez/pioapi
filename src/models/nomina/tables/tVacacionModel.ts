import { DataTypes, Model } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class tVacacionModel extends Model {
    public idVacacion!: number;
    public codEmpleado!: number | null;

    public ultimasVacaciones!: string | null;
    public periodoVacaciones!: string | null;
    public diasVacaciones!: number | null;

    public vacacion!: number;
    public vacacionLiquido!: number;

    public fechaInicio!: string | null;
    public fechaFin!: string | null;

    public vigente!: boolean | null;
    public idAusencia!: number | null;
}

tVacacionModel.init(
    {
        idVacacion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        codEmpleado: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ultimasVacaciones: {
            type: DataTypes.DATE,
            allowNull: true
        },
        periodoVacaciones: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        diasVacaciones: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        vacacion: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false
        },
        vacacionLiquido: {
            type: DataTypes.DECIMAL(18, 2),
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
        vigente: {
            type: DataTypes.BOOLEAN, // bit en SQL Server
            allowNull: true
        },
        idAusencia: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize: sequelizeInit('NOMINA'),
        tableName: 'tVacacion',
        timestamps: false
    }
)

export default tVacacionModel