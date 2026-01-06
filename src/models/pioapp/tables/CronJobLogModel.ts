import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class CronJobLogModel extends Model {
    public id_cron_job!: number;
    public descripcion!: string;
    public tipo!: string;
    public intentos!: number;
    public success_job!: boolean;
    public data_context!: object | null;
    public userCreatedAt!: string | null;
    public userUpdatedAt!: string | null;
    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

CronJobLogModel.init(
    {
        id_cron_job: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        tipo: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        intentos: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        success_job: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        data_context: {
            type: DataTypes.JSONB,
            allowNull: true
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
        tableName: 'cron_job',
        schema: 'log',
        timestamps: true
    }
)

export default CronJobLogModel