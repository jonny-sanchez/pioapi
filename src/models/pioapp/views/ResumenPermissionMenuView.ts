import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class ResumenPermissionMenuView extends Model {
    public id_permission_menu?: number;
    public id_rol?: number;
    public name_rol?: string;
    public id_menu_app?: number;
    public name_route?: string;
    public title?: string;
    public id_categorias_menu?: number;
    public name_category?: string;
    public id_type_menu?: number;
    public name_type_menu?: string;
}

ResumenPermissionMenuView.init(
    {
        id_permission_menu: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
        id_rol: { type: DataTypes.INTEGER, allowNull: false },
        name_rol: { type: DataTypes.STRING(500), allowNull: false },
        id_menu_app: { type: DataTypes.INTEGER, allowNull: false },
        name_route: { type: DataTypes.STRING(500), allowNull: false },
        title: { type: DataTypes.STRING(500), allowNull: false },
        id_categorias_menu: { type: DataTypes.INTEGER, allowNull: false },
        name_category: { type: DataTypes.STRING(500), allowNull: false },
        id_type_menu: { type: DataTypes.INTEGER, allowNull: false },
        name_type_menu: { type: DataTypes.STRING(500), allowNull: false },
    },
    {
        sequelize: sequelizeInit('PIOAPP'),
        timestamps: false,
        tableName: 'vwResumenPermissionMenu',
        schema: 'app'
    }
)

export default ResumenPermissionMenuView