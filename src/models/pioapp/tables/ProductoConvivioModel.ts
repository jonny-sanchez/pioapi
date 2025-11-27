import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class ProductoConvivioModel extends Model{
    public id_productos_convivio!: number;
    public name_producto_convivio!: string;
    public descripcion_producto_convivio!: string | null;
    public id_category_productos_convivio!: number;
    public userCreatedAt!: number | null;
    public userUpdatedAt!: number | null;
    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

ProductoConvivioModel.init(
    {
        id_productos_convivio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name_producto_convivio: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        descripcion_producto_convivio: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        id_category_productos_convivio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userCreatedAt: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        userUpdatedAt: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    },
    {
        sequelize: sequelizeInit('PIOAPP'),
        tableName: "productos_convivio",
        schema: "app",
        timestamps: true
    }
)

export default ProductoConvivioModel