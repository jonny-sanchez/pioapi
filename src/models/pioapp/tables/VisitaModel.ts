import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class VisitaModel extends Model {
    public id_visita!: number;
    public photo_gps_longitude?: string;
    public empresa?: string;
    public tienda?: string;
    public tienda_nombre?: string;
    public tienda_direccion?: string;
    public id_tipo_visita?: number;
    public photo_gps_latitude?: string;
    public phone_gps_longitude!: string;
    public phone_gps_latitude!: string;
    public name_original_image?: string;
    public url_image!: string;
    public id_form_supervision!: number;
    public comentario?: string;
    public google_maps_url?: string;
    public userCreatedAt?: bigint;
    public userUpdatedAt?: bigint;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

VisitaModel.init(
    {
        id_visita: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        empresa: { type: DataTypes.STRING(10), allowNull: false },
        tienda: { type: DataTypes.STRING(10), allowNull: false },
        tienda_nombre: { type: DataTypes.STRING(500), allowNull: false },
        tienda_direccion: { type: DataTypes.TEXT, allowNull: true },
        id_tipo_visita: { type: DataTypes.INTEGER, allowNull: false },
        photo_gps_longitude: { type: DataTypes.TEXT, allowNull: true },
        photo_gps_latitude: { type: DataTypes.TEXT, allowNull: true },
        phone_gps_longitude: { type: DataTypes.TEXT, allowNull: false },
        phone_gps_latitude: { type: DataTypes.TEXT, allowNull: false },
        name_original_image: { type: DataTypes.TEXT, allowNull: true },
        url_image: { type: DataTypes.TEXT, allowNull: false },
        id_form_supervision: { type: DataTypes.INTEGER, allowNull: true },
        comentario: { type: DataTypes.STRING(500), allowNull: true },
        google_maps_url: { type: DataTypes.TEXT, allowNull: false },
        userCreatedAt: { type: DataTypes.BIGINT, allowNull: true },
        userUpdatedAt: { type: DataTypes.BIGINT, allowNull: true },
    },
    {
        sequelize: sequelizeInit('PIOAPP'),
        tableName: 'visita',
        schema: 'app',
        timestamps: true
    }
)

export default VisitaModel