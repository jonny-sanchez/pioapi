import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";
// import { Table } from '@sequelize/core/decorators-legacy';

// @Table({ noPrimaryKey: true })
class RutasView extends Model {
    public id!: number;
    public id_pedido!: number;
    public empresa?: string;
    public tienda?: string;
    public fecha_entrega?: Date | string;
    public piloto?: string;
    public no_ruta?: number;
    public nombre_ruta?: string;
    public cede?: string;
    public id_tipo_entrega!: number;
    public name_tipo_entrega!: string;
    public tienda_nombre?: string;
    public tienda_direccion?: string;
    public serie?: string;
    public codigo_empleado_piloto?: number;
    public recepccionada?: number;
}

RutasView.init(
    {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        id_pedido: { type: DataTypes.INTEGER, allowNull: true },
        empresa: { type: DataTypes.STRING(5), allowNull: true },
        tienda: { type: DataTypes.STRING(11), allowNull: true },
        fecha_entrega: { type: DataTypes.DATEONLY, allowNull: true },
        piloto: { type: DataTypes.STRING(250), allowNull: true },
        no_ruta: { type: DataTypes.INTEGER, allowNull: true },
        nombre_ruta: { type: DataTypes.STRING(100), allowNull: true },
        cede: { type: DataTypes.STRING(100), allowNull: true },
        id_tipo_entrega: { type: DataTypes.INTEGER, allowNull: false },
        name_tipo_entrega: { type: DataTypes.STRING(7), allowNull: false },
        tienda_nombre: { type: DataTypes.STRING(256), allowNull: true },
        tienda_direccion: { type: DataTypes.STRING(512), allowNull: true },
        serie: { type: DataTypes.STRING(100), allowNull: true },
        codigo_empleado_piloto: { type: DataTypes.INTEGER, allowNull: true },
        recepccionada: { type: DataTypes.INTEGER, allowNull: true }
    },
    {
        sequelize: sequelizeInit('GRUPOPINULITO'),
        tableName: 'vwRutas', 
        timestamps: false,
    }
)

export default RutasView