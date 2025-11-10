import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class InsumosEncabezadoRecepcionadosView extends Model{
    // public id?: number;
    public idSolicitud!: number;
    public tienda?: string;
    public fecha?: string;
    public fechaRequerido?: string;
    public almacenCentral?: string;
    public almacenDestino?: string;
    public comentario?: string;
    public cardCode?: string;
    public serie!: string;
    public numero!: number;
    public idEntrada!: number;
}

InsumosEncabezadoRecepcionadosView.init(
    {
        // id: {
        //     type: DataTypes.BIGINT,
        //     allowNull: true,
        //     primaryKey: true,
        //     // autoIncrement: true
        // },
        idSolicitud: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        tienda: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        fecha: {
            type: DataTypes.STRING(4000),
            allowNull: true
        },
        fechaRequerido: {
            type: DataTypes.STRING(4000),
            allowNull: true
        },
        almacenCentral: {
            type: DataTypes.STRING(52),
            allowNull: true
        },
        almacenDestino: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        comentario: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        cardCode: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        serie: {
            type: DataTypes.STRING(4),
            allowNull: false,
            primaryKey: true
        },
        numero: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idEntrada: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize: sequelizeInit('GRUPOPINULITO'),
        tableName: "vwInsumosEncabezadoRecepccionados",
        timestamps: false
    }
)

export default InsumosEncabezadoRecepcionadosView