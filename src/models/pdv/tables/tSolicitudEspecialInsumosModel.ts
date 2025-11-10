import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class tSolicitudEspecialInsumosModel extends Model {
    public idSolicitud!: number;
    public codigoTienda!: string | null;
    public cardCode!: string | null;
    public codTienda!: string | null;
    public comments!: string | null;
    public fechaPedido!: Date | null;
    public usuarioSolicita!: number | null;
    public usuarioRevisa!: number | null;
    public ordeRuta!: number | null;
    public ruta!: string | null;
    public piloto!: string | null;
    public vehiculo!: string | null;
    public docNum!: number | null;
    public docEntry!: number | null;
    public serie!: string | null;
    public docEntryRecp!: number | null;
    public docNumRecp!: number | null;
    public situacionRep!: number | null;
    public fechaSolicitud!: Date | null;
    public vigente!: number | null;
    public situacion!: number | null;
    public comentarioTienda!: string | null;
}

tSolicitudEspecialInsumosModel.init(
    {
        idSolicitud: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        codigoTienda: {
            type: DataTypes.STRING(11),
            allowNull: true
        },
        cardCode: {
            type: DataTypes.STRING(7),
            allowNull: true
        },
        codTienda: {
            type: DataTypes.STRING(7),
            allowNull: true
        },
        comments: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        fechaPedido: {
            type: DataTypes.DATE,
            allowNull: true
        },
        usuarioSolicita: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        usuarioRevisa: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ordeRuta: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ruta: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        piloto: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        vehiculo: {
            type: DataTypes.STRING(64),
            allowNull: true
        },
        docNum: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        docEntry: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        serie: {
            type: DataTypes.STRING(5),
            allowNull: true
        },
        docEntryRecp: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        docNumRecp: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        situacionRep: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fechaSolicitud: {
            type: DataTypes.DATE,
            allowNull: true
        },
        vigente: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        situacion: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        comentarioTienda: {
            type: DataTypes.STRING(3000),
            allowNull: true
        }
    },
    {
        sequelize: sequelizeInit('PDV'),
        // tableName: 'tSolicitudEspecialInsumosPrueba',
        tableName: 'tSolicitudEspecialInsumos',
        timestamps: false
    }
)

export default tSolicitudEspecialInsumosModel