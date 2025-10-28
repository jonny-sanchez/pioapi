import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class UltimosPeriodosPagadosView extends Model { 
    public idPeriodo!: number;
    public nombrePeriodo?: string;
    public fechaInicio!: string;
    public fechaFin!: string;
}

UltimosPeriodosPagadosView.init(
    {
        idPeriodo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        nombrePeriodo: {
            type: DataTypes.STRING(64),
            allowNull: true,
        },
        fechaInicio: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        fechaFin: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInit('NOMINA'),
        tableName: "vwUltimosPeriodosPagados",
        timestamps: false,
    }
);

export default UltimosPeriodosPagadosView;