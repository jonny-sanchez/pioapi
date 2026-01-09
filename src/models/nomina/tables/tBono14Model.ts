import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class tBono14Model extends Model {
     public idBono14!: number;
    public codEmpleado!: number | null;
    public anio!: number | null;

    public julio!: number | null;
    public agosto!: number | null;
    public septiembre!: number | null;
    public octubre!: number | null;
    public noviembre!: number | null;
    public diciembre!: number | null;
    public enero!: number | null;
    public febrero!: number | null;
    public marzo!: number | null;
    public abril!: number | null;
    public mayo!: number | null;
    public junio!: number | null;

    public total!: number | null;
    public bono14!: number | null;
    public anticipo!: number | null;
    public liquido!: number | null;

    public observacion!: string | null;
    public codEmpresa!: number | null;
    public codDepto!: number | null;
    public aliasCodigo!: string | null;
}

tBono14Model.init(
    {
        idBono14: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        codEmpleado: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        anio: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        julio: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
        agosto: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
        septiembre: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
        octubre: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
        noviembre: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
        diciembre: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
        enero: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
        febrero: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
        marzo: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
        abril: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
        mayo: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
        junio: { type: DataTypes.DECIMAL(18, 2), allowNull: true },

        total: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: true
        },
        bono14: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: true
        },
        anticipo: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: true
        },
        liquido: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: true
        },

        observacion: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        codEmpresa: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        codDepto: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        aliasCodigo: {
            type: DataTypes.STRING(6),
            allowNull: true
        }
    },
    {
        sequelize: sequelizeInit('NOMINA'),
        tableName: 'tBono14',
        timestamps: false
    }
)

export default tBono14Model