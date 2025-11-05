import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class PolloDetalleRecepcionView extends Model {
    public id?: number;
    public SkuEqv?: string;
    public ItemCode!: string;
    public itemName?: string;
    public cantidad?: number;
    public precioTotal?: number;
    public idEntradaInventario!: number;
}

PolloDetalleRecepcionView.init(
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            primaryKey: true
        },
        SkuEqv: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        ItemCode: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        itemName: {
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
        idEntradaInventario: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize: sequelizeInit('GRUPOPINULITO'),
        tableName: "vwPolloDetalleRecepcion",
        timestamps: false
    }
);

export default PolloDetalleRecepcionView;
