import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class FirmaBoletaPagoModel extends Model {
    declare id_firma_boleta_pago: string;
    declare id_users: bigint;
    declare id_periodo: number;
    declare phone_gps_longitude: string;
    declare phone_gps_latitude: string;
    declare hash_boleta_firmada: string;
    declare valido: boolean;
    declare motivo_invalidacion: string | null;
    declare userCreatedAt: bigint | null;
    declare userUpdatedAt: bigint | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

FirmaBoletaPagoModel.init(
    {
        id_firma_boleta_pago: { 
            type: DataTypes.UUID, 
            primaryKey: true, 
            defaultValue: DataTypes.UUIDV4,
            allowNull: false 
        },
        id_users: { 
            type: DataTypes.BIGINT, 
            allowNull: false 
        },
        id_periodo: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        phone_gps_longitude: { 
            type: DataTypes.TEXT, 
            allowNull: false 
        },
        phone_gps_latitude: { 
            type: DataTypes.TEXT, 
            allowNull: false 
        },
        hash_boleta_firmada: { 
            type: DataTypes.TEXT, 
            allowNull: false 
        },
        valido: { 
            type: DataTypes.BOOLEAN, 
            allowNull: false, 
            defaultValue: true 
        },
        motivo_invalidacion: { 
            type: DataTypes.TEXT, 
            allowNull: true 
        },
        userCreatedAt: { 
            type: DataTypes.BIGINT, 
            allowNull: true 
        },
        userUpdatedAt: { 
            type: DataTypes.BIGINT, 
            allowNull: true 
        },
    },
    {
        sequelize: sequelizeInit('PIOAPP'),
        tableName: 'firma_boleta_pago',
        schema: 'app',
        timestamps: true
    }
)

export default FirmaBoletaPagoModel