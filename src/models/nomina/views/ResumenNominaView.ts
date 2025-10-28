import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class ResumenNominaView extends Model {
    public idPeriodo!: number;
    public codEmpleado!: number;
    public idPlanilla!: number;
    public nombrePeriodo!: string;
    public rangoPeriodo?: string;
    public nombreDepartamento?: string;
    public descripcionIngresos?: string;
    public totalIngresos!: number;
    public descripcionDescuentos?: string;
    public totalDescuentos!: number;
    public totalPago!: number;
}

ResumenNominaView.init(
    {
        idPeriodo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        codEmpleado: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idPlanilla: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        nombrePeriodo: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        rangoPeriodo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nombreDepartamento: {
            type: DataTypes.STRING(128),
            allowNull: true
        },
        descripcionIngresos: {
            type: DataTypes.STRING,
            allowNull: true
        },
        totalIngresos: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false
        },
        descripcionDescuentos: {
            type: DataTypes.STRING,
            allowNull: true
        },
        totalDescuentos: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false
        },
        totalPago: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false
        },
    },
    {
        sequelize: sequelizeInit('NOMINA'),
        tableName: "vwResumenNomina",
        timestamps: false,
    }
);

export default ResumenNominaView;