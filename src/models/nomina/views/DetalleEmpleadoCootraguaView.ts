import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class DetalleEmpleadoCootraguaView extends Model { 
    public codEmpleado!: number;
    public nombreEmpleado!: string;
    public apellidoEmpleado!: string;
    public segundoNombre?: string;
    public segundoApellido?: string;
    public apellidoCasada?: string;
    public sexo!: string;
    public direccion!: string;
    public paisOrigen!: string;
    public discapacidad!: string;
    public estadoCivil!: string;
    public raza!: string;
    public tipoDoc!: string;
    public noDoc!: string;
    public departNac!: string;
    public muniNac!: string;
    public departVec!: string;
    public muniVec!: string;
    public fechaNac?: string;
    public fechaNac_2?: string;
    public conyugue?: string;
    public noIGGS!: string;
    public numeroHijos!: number;
    public NIT!: string;
    public fechaVecIRTRA?: string;
    public email?: string;
    public noTel?: string;
    public noTelEmerg!: string;
    public noTelNoti!: string;
    public nomBeneficiario?: string;
    public celBeneficiario!: string;
    public banco!: string;
    public noCuenta!: string;
    public noLicen?: string;
    public tipoLicen?: string;
    public fechaVecLicen?: string;
    public noLicenGun?: string;
    public fechaVecLicenGun?: string;
    public noContract?: number;
    public venciTarjSal?: string;
    public venciTarjPul?: string;
    public venciTarjMan?: string;
    public codEmpleadoJefe?: number;
    public jefeInmediato?: string;
    public nombreEmpleadoCompleto!: string;
    public codEmpresa?: number;
    public nombreDepto?: string;
    public nombreEmpresa?: string;
    public password?: string;
    public codJefeDepto?: number;
    public activoContrato?: boolean;
    public profesion?: string;
    public activoEmpleado?: boolean;
    public aliasCodigo?: string;
    public nomContactEmerg?: string;
    public numContactEmerg?: string;
    public parenContactEmerg?: string;
    public tipoSangre?: string;
    public empleadoTrato?: boolean;
    public empresaTrato?: number;
    public fechaIngreso?: Date;
    public fecha_ingreso_str?: string;
    public codDepto?: number;
    public nomPuesto?: string;
}

DetalleEmpleadoCootraguaView.init(
    {
        codEmpleado: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
        nombreEmpleado: { type: DataTypes.STRING(32), allowNull: false },
        apellidoEmpleado: { type: DataTypes.STRING(24), allowNull: false },
        segundoNombre: { type: DataTypes.STRING(128), allowNull: true },
        segundoApellido: { type: DataTypes.STRING(128), allowNull: true },
        apellidoCasada: { type: DataTypes.STRING(24), allowNull: true },
        sexo: { type: DataTypes.STRING(9), allowNull: false },
        direccion: { type: DataTypes.STRING(100), allowNull: false },
        paisOrigen: { type: DataTypes.STRING(56), allowNull: false },
        discapacidad: { type: DataTypes.STRING(20), allowNull: false },
        estadoCivil: { type: DataTypes.STRING(10), allowNull: false },
        raza: { type: DataTypes.STRING(10), allowNull: false },
        tipoDoc: { type: DataTypes.STRING(10), allowNull: false },
        noDoc: { type: DataTypes.STRING(20), allowNull: false },
        departNac: { type: DataTypes.STRING(35), allowNull: false },
        muniNac: { type: DataTypes.STRING(35), allowNull: false },
        departVec: { type: DataTypes.STRING(35), allowNull: false },
        muniVec: { type: DataTypes.STRING(35), allowNull: false },
        fechaNac: { type: DataTypes.STRING(30), allowNull: true },
        fechaNac_2: { type: DataTypes.STRING(30), allowNull: true },
        conyugue: { type: DataTypes.STRING(128), allowNull: true },
        noIGGS: { type: DataTypes.STRING(20), allowNull: false },
        numeroHijos: { type: DataTypes.INTEGER, allowNull: false },
        NIT: { type: DataTypes.STRING(12), allowNull: false },
        fechaVecIRTRA: { type: DataTypes.STRING(30), allowNull: true },
        email: { type: DataTypes.STRING(512), allowNull: true },
        noTel: { type: DataTypes.STRING(9), allowNull: true },
        noTelEmerg: { type: DataTypes.STRING(9), allowNull: false },
        noTelNoti: { type: DataTypes.STRING(9), allowNull: false },
        nomBeneficiario: { type: DataTypes.STRING(128), allowNull: true },
        celBeneficiario: { type: DataTypes.STRING(9), allowNull: false },
        banco: { type: DataTypes.STRING(32), allowNull: false },
        noCuenta: { type: DataTypes.STRING(32), allowNull: false },
        noLicen: { type: DataTypes.STRING(15), allowNull: true },
        tipoLicen: { type: DataTypes.STRING(2), allowNull: true },
        fechaVecLicen: { type: DataTypes.STRING(30), allowNull: true },
        noLicenGun: { type: DataTypes.STRING(15), allowNull: true },
        fechaVecLicenGun: { type: DataTypes.STRING(30), allowNull: true },
        noContract: { type: DataTypes.INTEGER, allowNull: true },
        venciTarjSal: { type: DataTypes.STRING(30), allowNull: true },
        venciTarjPul: { type: DataTypes.STRING(30), allowNull: true },
        venciTarjMan: { type: DataTypes.STRING(30), allowNull: true },
        codEmpleadoJefe: { type: DataTypes.INTEGER, allowNull: true },
        jefeInmediato: { type: DataTypes.STRING(315), allowNull: true },
        nombreEmpleadoCompleto: { type: DataTypes.STRING(315), allowNull: false },
        codEmpresa: { type: DataTypes.INTEGER, allowNull: true },
        nombreDepto: { type: DataTypes.STRING(128), allowNull: true },
        nombreEmpresa: { type: DataTypes.STRING(64), allowNull: true },
        password: { type: DataTypes.STRING(32), allowNull: true },
        codJefeDepto: { type: DataTypes.INTEGER, allowNull: true },
        activoContrato: { type: DataTypes.BOOLEAN, allowNull: true },
        profesion: { type: DataTypes.STRING(128), allowNull: true },
        activoEmpleado: { type: DataTypes.BOOLEAN, allowNull: true },
        aliasCodigo: { type: DataTypes.STRING(6), allowNull: true },
        nomContactEmerg: { type: DataTypes.STRING(128), allowNull: true },
        numContactEmerg: { type: DataTypes.STRING(9), allowNull: true },
        parenContactEmerg: { type: DataTypes.STRING(64), allowNull: true },
        tipoSangre: { type: DataTypes.STRING(12), allowNull: true },
        empleadoTrato: { type: DataTypes.BOOLEAN, allowNull: true },
        empresaTrato: { type: DataTypes.INTEGER, allowNull: true },
        fechaIngreso: { type: DataTypes.DATE, allowNull: true },
        fecha_ingreso_str: { type: DataTypes.STRING(30), allowNull: true },
        codDepto: { type: DataTypes.INTEGER, allowNull: true },
        nomPuesto: { type: DataTypes.STRING(64), allowNull: true },
    },
    {
        sequelize: sequelizeInit('NOMINA'),
        tableName: 'vwDetalleEmpleadoCootragua',
        timestamps: false
    }
)

export default DetalleEmpleadoCootraguaView