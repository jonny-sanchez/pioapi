import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class TiendasModuloView extends Model {
    public id_departamento!: number;
    public id_tienda!: number;
    public codigo_empresa!: string;
    public nombre_empresa!: string;
    public codigo_tienda!: string;
    public nombre_tienda!: string;
    public direccion_tienda!: string;
    public altitud!: string;
    public latitud!: string;
    public numero_establecimiento_sat!: number;
    public codigo_administrador!: number;
    public nombre_administrador!: string;
    public codigo_subadministrador!: number;
    public nombre_subadministrador!: string;
    public division!: string;
    public inactiva!: boolean;
    public nombre_lista_precio!: string;
    public listaPrecios!: number;
    public nombreComercial!: string;
    public nombre_menu!: string;
    public divisionNombre!: string;
    public celular!: string;
    public idSupervisor!: number;
    public administrador!: string;
    public afiliacionCredomatic!: string;
    public tipoMenu!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

TiendasModuloView.init(
    {
        id_departamento: { type: DataTypes.INTEGER, allowNull: true },
        id_tienda: { type: DataTypes.INTEGER, allowNull: true },
        codigo_empresa: { type: DataTypes.STRING(6), allowNull: false, primaryKey: true },
        codigo_tienda: { type: DataTypes.STRING(6), allowNull: false, primaryKey: true },
        nombre_empresa: { type: DataTypes.STRING(64), allowNull: false },
        nombre_tienda: { type: DataTypes.STRING(256), allowNull: false },
        direccion_tienda: { type: DataTypes.STRING(512), allowNull: false },
        altitud: { type: DataTypes.STRING(50), allowNull: false },
        latitud: { type: DataTypes.STRING(50), allowNull: false },
        numero_establecimiento_sat: { type: DataTypes.INTEGER, allowNull: true },
        codigo_administrador: { type: DataTypes.INTEGER, allowNull: true },
        nombre_administrador: { type: DataTypes.STRING(57), allowNull: false },
        codigo_subadministrador: { type: DataTypes.INTEGER, allowNull: true },
        nombre_subadministrador: { type: DataTypes.STRING(57), allowNull: false },
        division: { type: DataTypes.STRING(64), allowNull: false },
        inactiva: { type: DataTypes.BOOLEAN, allowNull: true },
        nombre_lista_precio: { type: DataTypes.STRING(250), allowNull: false },
        listaPrecios: { type: DataTypes.INTEGER, allowNull: true },
        nombreComercial: { type: DataTypes.STRING(64), allowNull: false },
        nombre_menu: { type: DataTypes.STRING(255), allowNull: false },
        divisionNombre: { type: DataTypes.STRING(64), allowNull: false },
        celular: { type: DataTypes.STRING(8), allowNull: false },
        idSupervisor: { type: DataTypes.INTEGER, allowNull: true },
        administrador: { type: DataTypes.STRING(64), allowNull: false },
        afiliacionCredomatic: { type: DataTypes.STRING(11), allowNull: false },
        tipoMenu: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
        sequelize: sequelizeInit('PDV'),
        tableName: 'vwTiendasModulo',
        timestamps: false
    }
)

export default TiendasModuloView