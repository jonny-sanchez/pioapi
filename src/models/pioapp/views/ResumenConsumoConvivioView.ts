import { Model , DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class ResumenConsumoConvivioView extends Model {
    public id_personas_convivio!: number | null;
    public codigo!: number | null;
    public id_tipo_persona_convivio!: number | null;
    public nombre_persona_convivio!: string | null;
    public empresa!: string | null;

    public id_productos_convivio!: number | null;
    public name_producto_convivio!: string | null;
    public descripcion_producto_convivio!: string | null;

    public id_category_productos_convivio!: number | null;
    public name_category_productos_convivio!: string | null;

    public fecha_creacion_producto!: string | null;
    public total_consumido!: number | null;
}

ResumenConsumoConvivioView.init(
    {
        id_personas_convivio: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true
        },
        codigo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_tipo_persona_convivio: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        nombre_persona_convivio: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        empresa: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        id_productos_convivio: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true
        },
        name_producto_convivio: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        descripcion_producto_convivio: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        id_category_productos_convivio: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        name_category_productos_convivio: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        fecha_creacion_producto: {
            type: DataTypes.DATE,
            allowNull: true
        },
        total_consumido: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    },
    {
        sequelize: sequelizeInit('PIOAPP'),
        tableName: "vwResumenConsumoConvivio",
        schema: "app",
        timestamps: false
    }
)

export default ResumenConsumoConvivioView