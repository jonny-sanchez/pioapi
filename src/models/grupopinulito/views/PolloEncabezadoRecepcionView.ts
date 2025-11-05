import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class PolloEncabezadoRecepcionView extends Model {
    public id?: number;
    public fecha?: string;
    public empresa!: string;
    public tda_nombre!: string;
    public serie!: string;
    public numero!: number;
    public idEntrada!: number;
    public tienda?: string;
    public cardCode!: string;
}

PolloEncabezadoRecepcionView.init(
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            primaryKey: true
        },
        fecha: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        empresa: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        tda_nombre: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        serie: {
            type: DataTypes.STRING(4),
            allowNull: false
        },
        numero: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idEntrada: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tienda: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        cardCode: {
            type: DataTypes.STRING(7),
            allowNull: false
        }
    },
    {
        sequelize: sequelizeInit('GRUPOPINULITO'),
        tableName: "vwPolloEncabezadoRecepcion",
        timestamps: false
    }
);

export default PolloEncabezadoRecepcionView;
