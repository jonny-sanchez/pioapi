import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class tPeriodoModel extends Model {
    declare idPeriodo: number;
    declare nombrePeriodo: string | null;
    declare fechaInicio: Date;
    declare fechaFin: Date;
    declare pagada: boolean;
    declare noQuincena: number | null;
    declare activo: boolean;
}

tPeriodoModel.init(
    {
        idPeriodo: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false 
        },
        nombrePeriodo: { 
            type: DataTypes.STRING(64), 
            allowNull: true 
        },
        fechaInicio: { 
            type: DataTypes.DATEONLY, 
            allowNull: false 
        },
        fechaFin: { 
            type: DataTypes.DATEONLY, 
            allowNull: false 
        },
        pagada: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true,
            defaultValue: false
        },
        noQuincena: { 
            type: DataTypes.INTEGER, 
            allowNull: true 
        },
        activo: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true,
            defaultValue: true
        }
    },
    {
        sequelize: sequelizeInit('NOMINA'),
        tableName: 'tPeriodo',
        schema: 'dbo',
        timestamps: false // SQL Server no tiene createdAt/updatedAt automáticos
    }
)

export default tPeriodoModel