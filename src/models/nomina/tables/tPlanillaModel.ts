import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class tPlanillaModel extends Model {
    declare idPlanilla: number;
    declare idEmpresa: number;
    declare idPeriodo: number;
    declare codEmpleado: number;
    declare departamento: string;
    declare codigo: string;
    declare empleado: string;
    declare salarioMensual: number;
    declare ordinario: number | null;
    declare diasLaborados: number;
    declare hSimples: number;
    declare hDobles: number;
    declare sSimples: number | null;
    declare sDobles: number | null;
    declare bonifDecreto: number | null;
    declare otrosIngresos: number | null;
    declare neto: number | null;
    declare igss: number | null;
    declare isr: number | null;
    declare seguro: number | null;
    declare ahorro: number | null;
    declare otrosDescuentos: number | null;
    declare liquido: number | null;
    declare comentarios: string | null;
    declare anticipos: number | null;
}

tPlanillaModel.init(
    {
        idPlanilla: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false 
        },
        idEmpresa: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        idPeriodo: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        codEmpleado: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        departamento: { 
            type: DataTypes.STRING(64), 
            allowNull: false 
        },
        codigo: { 
            type: DataTypes.STRING(8), 
            allowNull: false 
        },
        empleado: { 
            type: DataTypes.STRING(128), 
            allowNull: false 
        },
        salarioMensual: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false 
        },
        ordinario: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        diasLaborados: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        hSimples: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        hDobles: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        sSimples: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        sDobles: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        bonifDecreto: { 
            type: DataTypes.DECIMAL(8, 2), 
            allowNull: true 
        },
        otrosIngresos: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        neto: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        igss: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        isr: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        seguro: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        ahorro: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        otrosDescuentos: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        liquido: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        comentarios: { 
            type: DataTypes.STRING(512), 
            allowNull: true 
        },
        anticipos: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        }
    },
    {
        sequelize: sequelizeInit('NOMINA'),
        tableName: 'tPlanilla',
        schema: 'dbo',
        timestamps: false // SQL Server no tiene createdAt/updatedAt automáticos
    }
)

export default tPlanillaModel