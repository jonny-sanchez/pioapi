import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class TokenNotificationPushModel extends Model {
    public id_token_notification_push!: number;
    public id_unique_device!: string;
    public id_users!: number;
    public exponent_push_token!: string;
    public userCreatedAt!: number | null;
    public userUpdatedAt!: number | null;
    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

TokenNotificationPushModel.init(
    {
        id_token_notification_push: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        id_unique_device: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        id_users: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        exponent_push_token: {
            type: DataTypes.TEXT,
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
        tableName: "token_notification_push",
        schema: "app",
        timestamps: true
    }
)

export default TokenNotificationPushModel