import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class ResumenPermissionTipoVisitaView extends Model {
    public id_permission_tipo_visita?: number;
    public id_tipo_visita?: number;
    public name?: string;
    public id_rol?: number;
    public name_rol?: string;
}

ResumenPermissionTipoVisitaView.init(
    {
        id_permission_tipo_visita: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        id_tipo_visita: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        id_rol: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name_rol: {
            type: DataTypes.STRING(250),
            allowNull: false
        }
    },
    {
        tableName: "vwResumenPermissionTipoVisita",
        schema: "app",
        sequelize: sequelizeInit('PIOAPP'),
        timestamps: false
    }
)

export default ResumenPermissionTipoVisitaView