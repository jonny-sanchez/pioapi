import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class InsumosDetalleRecepcionView extends Model {
    // public id?: bigint;
    public idEntradaInventario!: number;
    public ItemCode!: string;
    public ItemName?: string;
    public cantidad?: number;
    public precioTotal?: number;
    public porcentaje?: number;
}

InsumosDetalleRecepcionView.init(
    {
        // id: {
        //     type: DataTypes.BIGINT,
        //     allowNull: true,
        //     primaryKey: true,
        //     autoIncrement: true
        // },
        idEntradaInventario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        ItemCode: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true
        },
        ItemName: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        cantidad: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        precioTotal: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        porcentaje: {
            type: DataTypes.DECIMAL,
            allowNull: true
        }
    },
    {
        sequelize: sequelizeInit('GRUPOPINULITO'),
        tableName: "vwInsumosDetalleRecepcion",
        timestamps: false
    }
)

export default InsumosDetalleRecepcionView