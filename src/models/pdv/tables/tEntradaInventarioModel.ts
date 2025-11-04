import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";


class tEntradaInventarioModel extends Model {
    public idEntradaInventario!: number;
    public serie!: string;
    public numero!: number;
    public empresa!: string;
    public tienda!: string;
    public fecha!: any;
    public anulado!: boolean | null;
    public docEntry!: number | null;
    public docNum!: number | null;
}

tEntradaInventarioModel.init(
    {
        idEntradaInventario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        serie: {
            type: DataTypes.STRING(4),
            allowNull: false
        },
        numero: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        empresa: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        tienda: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        anulado: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        docEntry: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        docNum: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize: sequelizeInit('PDV'),
        tableName: 'tEntradaInventarioPrueba',
        timestamps: false
    }
)

export default tEntradaInventarioModel