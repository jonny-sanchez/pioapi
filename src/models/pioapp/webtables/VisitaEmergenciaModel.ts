import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class VisitaEmergenciaModel extends Model {
    public id_visita?: number | undefined;
    public empresa?: string | undefined;
    public tienda?: string | undefined;
    public tienda_nombre?: string | undefined;
    public tienda_direccion?: string | null | undefined;
    public id_tipo_visita?: number | undefined;
    public last_gps_longitude?: string | null | undefined;
    public last_gps_latitude?: string | null | undefined;
    public new_gps_longitude?: string | undefined;
    public new_gps_latitude?: string | undefined;
    public comentario?: string | null | undefined;
    public id_estado?: number | undefined;
    public fecha_programacion?: string | null | undefined;
    public user_asignado?: string | undefined;
    public nombre_user_asignado?: string | undefined;
    public userCreatedAt?: number | null | undefined;
    public userUpdatedAt?: number | null | undefined;
    public createdAt?: string | null | undefined;
    public updatedAt?: string | null | undefined;
}

VisitaEmergenciaModel.init(
    {
        id_visita: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        empresa: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tienda: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tienda_nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tienda_direccion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        id_tipo_visita: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        last_gps_longitude: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        last_gps_latitude: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        new_gps_longitude: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        new_gps_latitude: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        comentario: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_estado: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_programacion: {
            type: DataTypes.DATE,
            allowNull: true
        },
        user_asignado: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nombre_user_asignado: {
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
        tableName: "tbl_visita_emergencia",
        schema: "web",
        timestamps: true
    }
)

export default VisitaEmergenciaModel