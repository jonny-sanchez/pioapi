import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class tEntradaInventarioDetalleModel extends Model {
    public idEntradaInventarioDetalle!: number;
    public idEntradaInventario!: number | null;
    public itemCode!: string;
    public uomCode!: string;
    public quantity!: number;
    public cantidadInventario!: number | null;
}

tEntradaInventarioDetalleModel.init(
    {
        idEntradaInventarioDetalle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        idEntradaInventario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        itemCode: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        uomCode: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        quantity: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false
        },
        cantidadInventario: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        }
    },
    {
        sequelize: sequelizeInit('PDV'),
        // tableName: 'tEntradaInventarioDetallePrueba',
        tableName: 'tEntradaInventarioDetalle',
        timestamps: false
    }
)

export default tEntradaInventarioDetalleModel