import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class CategoryProductosConvivioModel extends Model{
    public id_category_productos_convivio!: number;
    public name_category_productos_convivio!: string;
    public userCreatedAt!: number | null;
    public userUpdatedAt!: number | null;
    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

CategoryProductosConvivioModel.init(
    {
        id_category_productos_convivio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name_category_productos_convivio: {
            type: DataTypes.STRING(500),
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
        tableName: "category_productos_convivio",
        schema: "app",
        timestamps: true
    }
)

export default CategoryProductosConvivioModel