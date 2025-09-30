import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class FormSupervisionModel extends Model {
    public id_form_supervision!: number;
    public uso_uniforme!: boolean;
    public buzon_cerrado!: boolean;
    public tienda_limpia!: boolean;
    public cantidad_personas!: boolean;
    public cantidad?: number;
    public name_original_photo_personas?: string;
    public url_photo_personas?: string;
    public userCreatedAt?: bigint;
    public userUpdatedAt?: bigint;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

FormSupervisionModel.init(
    {
        id_form_supervision: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        uso_uniforme: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        buzon_cerrado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        tienda_limpia: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        cantidad_personas: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        cantidad: { type: DataTypes.INTEGER, allowNull: true },
        name_original_photo_personas: { type: DataTypes.TEXT, allowNull: true },
        url_photo_personas: { type: DataTypes.TEXT, allowNull: true },
        userCreatedAt: { type: DataTypes.BIGINT, allowNull: true },
        userUpdatedAt: { type: DataTypes.BIGINT, allowNull: true },
    },
    {
        sequelize: sequelizeInit('PIOAPP'),
        tableName: 'form_supervision',
        schema: 'app',
        timestamps: true
    }
)

export default FormSupervisionModel