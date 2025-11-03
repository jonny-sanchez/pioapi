import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class tFirmaBoletaModel extends Model {
    declare idFirmaBoleta: number;
    declare empresa: string;
    declare tienda: string;
    declare FechaHora: Date;
    declare codEmpleado: number;
    declare firma: string | null;
    declare idDispositivo: string;
    declare datosBoleta: string;
    declare idPeriodo: number;
    declare vigente: boolean;
}

tFirmaBoletaModel.init(
    {
        idFirmaBoleta: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false 
        },
        empresa: { 
            type: DataTypes.STRING(5), 
            allowNull: false 
        },
        tienda: { 
            type: DataTypes.STRING(5), 
            allowNull: false 
        },
        FechaHora: { 
            type: DataTypes.DATE, 
            allowNull: true, // Permitir null para que SQL Server maneje el DEFAULT
            // Sin defaultValue - SQL Server usará su constraint DEFAULT
            field: 'FechaHora'
        },
        codEmpleado: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        firma: { 
            type: DataTypes.STRING(36), 
            allowNull: true 
        },
        idDispositivo: { 
            type: DataTypes.STRING(32), 
            allowNull: false 
        },
        datosBoleta: { 
            type: DataTypes.STRING(1500), 
            allowNull: false 
        },
        idPeriodo: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        vigente: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true,
            defaultValue: true
        }
    },
    {
        sequelize: sequelizeInit('PDV'),
        tableName: 'tFirmaBoleta',
        schema: 'dbo',
        timestamps: false // SQL Server no tiene createdAt/updatedAt automáticos
    }
)

export default tFirmaBoletaModel