import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class tPeriodoEspecialBoletaModel extends Model {
    public idPeriodo?: number;
    public nombrePeriodo?: string | null;
    public fechaInicio?: string;
    public fechaFin?: string;
    public pagada?: boolean | null;
    public noQuincena?: number | null;
    public activo?: boolean | null;
    public tipo?: number;
    
}

tPeriodoEspecialBoletaModel.init(
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
        },
        tipo: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize: sequelizeInit('NOMINA'),
        tableName: 'tPeriodoEspecialBoleta',
        // schema: 'dbo',
        timestamps: false
    }
);

export default tPeriodoEspecialBoletaModel;
