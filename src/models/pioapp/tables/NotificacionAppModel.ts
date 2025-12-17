import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";
import AsuntoNotificacionModel from "./AsuntoNotificacionModel";

class NotificacionAppModel extends Model {
    public id_notificacion_app!: number;
    public title!: string;
    public body!: string;
    public dataPayload!: object | null;
    public id_asunto_notificacion!: number;
    public id_users!: number;
    public leido!: boolean;
    public userCreatedAt!: string | null;
    public userUpdatedAt!: string | null;
    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

NotificacionAppModel.init(
    {
        id_notificacion_app: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false
        },
        title: { 
            type: DataTypes.STRING(500), 
            allowNull: false 
        },
        body: { 
            type: DataTypes.STRING(500), 
            allowNull: false
        },
        dataPayload: { 
            type: DataTypes.JSONB, 
            allowNull: true
        },
        id_asunto_notificacion: { 
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        leido: {             
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        id_users: {
            type: DataTypes.BIGINT,
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
        tableName: 'notificacion_app',
        schema: 'app',
        timestamps: true
    }
)

NotificacionAppModel.belongsTo(AsuntoNotificacionModel, {
    foreignKey: 'id_asunto_notificacion'
})

export default NotificacionAppModel