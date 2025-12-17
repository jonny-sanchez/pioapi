import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class AsuntoNotificacionModel extends Model {
    public id_asunto_notificacion!: number;
    public name_asunto!: string;
    public userCreatedAt!: string | null;
    public userUpdatedAt!: string | null;
    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

AsuntoNotificacionModel.init(
    {
        id_asunto_notificacion: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false 
        },
        name_asunto: { 
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
        tableName: 'asunto_notificacion',
        schema: 'app',
        timestamps: true
    }
)

export default AsuntoNotificacionModel