import 'reflect-metadata';
import express, { Router } from 'express';
import 'dotenv/config';
import { Sequelize, DataTypes, Model } from 'sequelize';
import { injectable, inject, container } from 'tsyringe';
import { genSalt, hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as yup from 'yup';
import cors from 'cors';
import fileUpload from 'express-fileupload';

const ENV = process.env;
const DEFAULT_CONNECTION = "PIOAPP";
const configDatabase = {
  PIOAPP: {
    database: ENV.DB_DATABASE,
    username: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    options: {
      host: ENV.DB_HOST,
      port: ENV.DB_PORT,
      dialect: ENV.DB_CONNECTION
    }
  },
  NOMINA: {
    database: ENV.DB_SECOND_DATABASE,
    username: ENV.DB_SECOND_USERNAME,
    password: ENV.DB_SECOND_PASSWORD,
    options: {
      host: ENV.DB_SECOND_HOST,
      port: ENV.DB_SECOND_PORT,
      dialect: ENV.DB_SECOND_CONNECTION
    }
  },
  GRUPOPINULITO: {
    database: ENV.DB_THIRD_DATABASE,
    username: ENV.DB_THIRD_USERNAME,
    password: ENV.DB_THIRD_PASSWORD,
    options: {
      host: ENV.DB_THIRD_HOST,
      port: ENV.DB_THIRD_PORT,
      dialect: ENV.DB_THIRD_CONNECTION
    }
  },
  PDV: {
    database: ENV.DB_FOURTH_DATABASE,
    username: ENV.DB_FOURTH_USERNAME,
    password: ENV.DB_FOURTH_PASSWORD,
    options: {
      host: ENV.DB_FOURTH_HOST,
      port: ENV.DB_FOURTH_PORT,
      dialect: ENV.DB_FOURTH_CONNECTION
    }
  }
};

function sequelizeInit(instancia = DEFAULT_CONNECTION) {
  const dbConfig = configDatabase[instancia];
  const sequalize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig.options
  );
  return sequalize;
}
const connectionDb = async () => {
  try {
    Object.entries(configDatabase).forEach(async ([key, value]) => {
      const sequelize = sequelizeInit(key);
      await sequelize.authenticate();
      console.log(`Test conexion db ${value.database} exitoso`);
    });
  } catch (error) {
    console.log(`Error al realizar la conexion a la base de datos: ${error}`);
  }
};

class tEmpleadoModel extends Model {
  codEmpleado;
  nombreEmpleado;
  apellidoEmpleado;
  apellidoCasada;
  segundoNombre;
  segundoApellido;
  sexo;
  direccion;
  paisOrigen;
  discapacidad;
  estadoCivil;
  raza;
  tipoDoc;
  noDoc;
  departNac;
  muniNac;
  departVec;
  muniVec;
  fechaNac;
  // DATEONLY
  conyugue;
  noIGGS;
  NIT;
  fechaVecIRTRA;
  // DATEONLY
  email;
  noTel;
  noTelEmerg;
  noTelNoti;
  nomBeneficiario;
  celBeneficiario;
  banco;
  noCuenta;
  noLicen;
  tipoLicen;
  fechaVecLicen;
  // DATEONLY
  noLicenGun;
  fechaVecLicenGun;
  // DATEONLY
  noContract;
  venciTarjSal;
  // DATEONLY
  venciTarjPul;
  // DATEONLY
  venciTarjMan;
  // DATEONLY
  codEmpleadoJefe;
  password;
  profesion;
  activo;
  aliasCodigo;
  codForaneo;
  nomContactEmerg;
  numContactEmerg;
  parenContactEmerg;
  tipoSangre;
  creadoPor;
  modificadoPor;
  tokenWeb;
  empleadoTrato;
  empresaTrato;
  departamentoTrato;
  noDependientes;
  firma;
  huega;
  keyPass;
  numeroHijos;
}
tEmpleadoModel.init(
  {
    codEmpleado: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    nombreEmpleado: { type: DataTypes.STRING(32), allowNull: false },
    apellidoEmpleado: { type: DataTypes.STRING(24), allowNull: false },
    apellidoCasada: { type: DataTypes.STRING(24), allowNull: true },
    segundoNombre: { type: DataTypes.STRING(128), allowNull: true },
    segundoApellido: { type: DataTypes.STRING(128), allowNull: true },
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
    fechaNac: { type: DataTypes.DATEONLY, allowNull: false },
    conyugue: { type: DataTypes.STRING(128), allowNull: true },
    noIGGS: { type: DataTypes.STRING(20), allowNull: false },
    NIT: { type: DataTypes.STRING(12), allowNull: false },
    fechaVecIRTRA: { type: DataTypes.DATEONLY, allowNull: true },
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
    fechaVecLicen: { type: DataTypes.DATEONLY, allowNull: true },
    noLicenGun: { type: DataTypes.STRING(15), allowNull: true },
    fechaVecLicenGun: { type: DataTypes.DATEONLY, allowNull: true },
    noContract: { type: DataTypes.INTEGER, allowNull: true },
    venciTarjSal: { type: DataTypes.DATEONLY, allowNull: true },
    venciTarjPul: { type: DataTypes.DATEONLY, allowNull: true },
    venciTarjMan: { type: DataTypes.DATEONLY, allowNull: true },
    codEmpleadoJefe: { type: DataTypes.INTEGER, allowNull: true },
    password: { type: DataTypes.STRING(32), allowNull: true },
    profesion: { type: DataTypes.STRING(128), allowNull: true },
    activo: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
    aliasCodigo: { type: DataTypes.STRING(6), allowNull: true },
    codForaneo: { type: DataTypes.INTEGER, allowNull: true },
    nomContactEmerg: { type: DataTypes.STRING(128), allowNull: true },
    numContactEmerg: { type: DataTypes.STRING(9), allowNull: true },
    parenContactEmerg: { type: DataTypes.STRING(64), allowNull: true },
    tipoSangre: { type: DataTypes.STRING(12), allowNull: true },
    creadoPor: { type: DataTypes.INTEGER, allowNull: true },
    modificadoPor: { type: DataTypes.INTEGER, allowNull: true },
    tokenWeb: { type: DataTypes.STRING(256), allowNull: true },
    empleadoTrato: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    empresaTrato: { type: DataTypes.INTEGER, allowNull: true },
    departamentoTrato: { type: DataTypes.INTEGER, allowNull: true },
    noDependientes: { type: DataTypes.INTEGER, allowNull: true },
    firma: { type: DataTypes.STRING(250), allowNull: true },
    huega: { type: DataTypes.TEXT, allowNull: true },
    keyPass: { type: DataTypes.BLOB, allowNull: false, defaultValue: Buffer.from([]) },
    numeroHijos: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 }
  },
  {
    sequelize: sequelizeInit("NOMINA"),
    tableName: "tEmpleado",
    timestamps: false
  }
);

var __getOwnPropDesc$d = Object.getOwnPropertyDescriptor;
var __decorateClass$d = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$d(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let tEmpleadoRepository = class {
  async findByCodigo(codigo, error = true, raw = false) {
    const empleado = await tEmpleadoModel.findByPk(codigo, { raw });
    if (error) {
      if (!empleado) throw new Error("Empleado no encontrado.");
    }
    return empleado;
  }
};
tEmpleadoRepository = __decorateClass$d([
  injectable()
], tEmpleadoRepository);

var __getOwnPropDesc$c = Object.getOwnPropertyDescriptor;
var __decorateClass$c = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$c(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let CryptServices = class {
  saltRounds;
  constructor() {
    this.saltRounds = 10;
  }
  async Hash(text = "") {
    const salt = await genSalt(this.saltRounds);
    return hash(text, salt);
  }
  async Compare(text = "", textHash = "") {
    return compare(text, textHash);
  }
};
CryptServices = __decorateClass$c([
  injectable()
], CryptServices);

const KEY = process.env.JWT_SECRET || "key1Secret";
const EXPIRE = "72h";
function generateToken(payload) {
  return jwt.sign(payload, KEY, { expiresIn: EXPIRE });
}
function verifyToken(token) {
  try {
    return jwt.verify(token, KEY);
  } catch (error) {
    return null;
  }
}

class UsersModel extends Model {
  id_users;
  id_rol;
  first_name;
  second_name;
  first_last_name;
  second_last_name;
  email;
  password;
  userCreatedAt;
  userUpdatedAt;
  createdAt;
  updatedAt;
}
UsersModel.init(
  {
    id_users: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false },
    id_rol: { type: DataTypes.INTEGER, allowNull: false },
    first_name: { type: DataTypes.STRING(500), allowNull: false },
    second_name: { type: DataTypes.STRING(500), allowNull: true },
    first_last_name: { type: DataTypes.STRING(500), allowNull: true },
    second_last_name: { type: DataTypes.STRING(500), allowNull: true },
    email: { type: DataTypes.STRING(500), allowNull: true },
    password: { type: DataTypes.TEXT, allowNull: false },
    userCreatedAt: { type: DataTypes.BIGINT, allowNull: true },
    userUpdatedAt: { type: DataTypes.BIGINT, allowNull: true }
  },
  {
    sequelize: sequelizeInit("PIOAPP"),
    tableName: "users",
    schema: "app",
    timestamps: true
  }
);

var __getOwnPropDesc$b = Object.getOwnPropertyDescriptor;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$b(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let UsersRepository = class {
  async findById(id, error = true, raw = false) {
    const user = UsersModel.findByPk(id, { raw });
    if (error) {
      if (!user) throw new Error("Usuario no encontrado.");
    }
    return user;
  }
  async createUser(data, t = null) {
    const user = await UsersModel.create(data, { transaction: t });
    if (!user) throw new Error("Error al crear el usuario.");
    return user;
  }
};
UsersRepository = __decorateClass$b([
  injectable()
], UsersRepository);

var __getOwnPropDesc$a = Object.getOwnPropertyDescriptor;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$a(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$6 = (index, decorator) => (target, key) => decorator(target, key, index);
let UsersServices = class {
  constructor(usersRepository, cryptServices) {
    this.usersRepository = usersRepository;
    this.cryptServices = cryptServices;
  }
  async findOrCreateUserLogin(codigoEmpleado, empleado, t, json = false) {
    let user = await this.usersRepository.findById(codigoEmpleado, false);
    if (!user) user = await this.usersRepository.createUser(
      {
        id_users: empleado?.codEmpleado,
        id_rol: 1,
        first_name: empleado?.nombreEmpleado,
        second_name: empleado?.segundoNombre,
        first_last_name: empleado?.apellidoEmpleado,
        second_last_name: empleado?.segundoApellido,
        email: empleado?.email,
        password: await this.cryptServices.Hash(empleado?.password)
      },
      t
    );
    return json ? user?.toJSON() : user;
  }
};
UsersServices = __decorateClass$a([
  injectable(),
  __decorateParam$6(0, inject(UsersRepository)),
  __decorateParam$6(1, inject(CryptServices))
], UsersServices);

var __getOwnPropDesc$9 = Object.getOwnPropertyDescriptor;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$9(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$5 = (index, decorator) => (target, key) => decorator(target, key, index);
let AuthServices = class {
  constructor(tEmpleadoRepo, cryptServices, usersServices) {
    this.tEmpleadoRepo = tEmpleadoRepo;
    this.cryptServices = cryptServices;
    this.usersServices = usersServices;
  }
  async validLogin(data, t) {
    const codigoEmpleado = Number(data.codigo.substring(2));
    const empleado = await this.tEmpleadoRepo.findByCodigo(codigoEmpleado, true, true);
    const user = await this.usersServices.findOrCreateUserLogin(codigoEmpleado, empleado, t, true);
    const resultCompare = await this.cryptServices.Compare(data.password, user?.password);
    if (!resultCompare) throw new Error("Contrase\xF1a incorrecta.");
    const { password, ...userJson } = user;
    const token = generateToken(userJson);
    const userData = { ...userJson, token };
    return userData;
  }
};
AuthServices = __decorateClass$9([
  injectable(),
  __decorateParam$5(0, inject(tEmpleadoRepository)),
  __decorateParam$5(1, inject(CryptServices)),
  __decorateParam$5(2, inject(UsersServices))
], AuthServices);

async function handleSend(res, callback = async () => {
}, messageSuccess = "", isWithRollBack = false, connection = DEFAULT_CONNECTION, isFile = false) {
  let t;
  if (isWithRollBack) t = await sequelizeInit(connection).transaction();
  try {
    let result = null;
    result = await callback(t);
    if (isWithRollBack) t && await t.commit();
    return isFile ? result : res.status(200).json({ message: messageSuccess, status: true, data: result });
  } catch (error) {
    if (isWithRollBack) t && await t.rollback();
    console.log(error);
    const message = error?.message || error?.stack;
    return res.status(500).json({ message: message ?? "Error server internal", status: false, data: null });
  }
}

var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$4 = (index, decorator) => (target, key) => decorator(target, key, index);
let AuthController = class {
  constructor(authServices) {
    this.authServices = authServices;
  }
  async login(req, res) {
    await handleSend(res, async (t) => {
      const result = await this.authServices.validLogin(req.body, t);
      return result;
    }, "Credenciales correctas", true, "PIOAPP");
  }
};
AuthController = __decorateClass$8([
  injectable(),
  __decorateParam$4(0, inject(AuthServices))
], AuthController);

function BYTE(mb = 0) {
  return mb * 1024 * 1024;
}

const validateFields = (dto, configFiles = null) => async (req, res, next) => {
  try {
    await dto.validate(req.body, { abortEarly: false });
    if (configFiles) {
      configFiles.forEach((configFiles2) => {
        const required = configFiles2?.required ?? false;
        const fileEntry = (req?.files ?? {})[configFiles2.nameFormData] ?? null;
        const files = Array.isArray(fileEntry) ? fileEntry : [fileEntry];
        if (required && !fileEntry) throw new Error(`el campo [${configFiles2.nameFormData}] es obligatorio.`);
        if (!required && !fileEntry) return;
        if (configFiles2.minFiles && files.length < configFiles2.minFiles) throw new Error(`Debes subir al menos ${configFiles2.minFiles} archivo(s).`);
        if (configFiles2.maxFiles && files.length > configFiles2.maxFiles) throw new Error(`Solo puedes subir un maximo de ${configFiles2.maxFiles} archivo(s).`);
        files.forEach((el, index) => {
          if (configFiles2.minSize && el.size < BYTE(configFiles2.minSize)) throw new Error(`El archivo [${el.name}] es muy peque\xF1o. Tama\xF1o m\xEDnimo: ${configFiles2.minSize} MB.`);
          if (configFiles2.maxSize && el.size > BYTE(configFiles2.maxSize)) throw new Error(`El archivo [${el.name}] es demasiado grande. Tama\xF1o m\xE1ximo: ${configFiles2.maxSize} MB.`);
          if (configFiles2.allowedTypes) {
            const mime = el.mimetype;
            const isImage = mime.startsWith("image/");
            const isPdf = mime === "application/pdf";
            if (!(configFiles2.allowedTypes.includes("image") && isImage || configFiles2.allowedTypes.includes("pdf") && isPdf)) throw new Error(`El archivo [${el.name}] tiene un formato no permitido. Solo se aceptan im\xE1genes o PDF.`);
          }
        });
      });
    }
    next();
  } catch (error) {
    const errores = error?.errors || [];
    const textError = errores.join(", ") || error?.message || error?.stack || "Error middleware validate Fields (message not found.)";
    return res.status(400).json({ message: textError, status: false, errors: errores, data: null });
  }
};

const LoginDto = yup.object({
  // codigo: yup.number().integer().required('el [codigo] es un campo obligatorio'),
  codigo: yup.string().matches(/^[a-zA-Z]{2}\d+$/, "el [codigo] debe empezar con 2 letra y luego numeros.").required("el [codigo] es un campo obligatorio"),
  password: yup.string().required("el [password] es un campo obligatorio")
});

const authRouter = Router();
const authController = container.resolve(AuthController);
authRouter.post("/login", validateFields(LoginDto), authController.login.bind(authController));

const authMiddleware = (req, res, next) => {
  try {
    const bearerToken = req?.headers?.authorization || "";
    const objectAuth = bearerToken.split(" ");
    if ((objectAuth[0] || "") !== "Bearer") throw new Error("Auth method invalid.");
    const token = objectAuth[1] || "";
    if (!token) throw new Error("No token provided.");
    const user = verifyToken(token);
    if (!user) throw new Error("Unauthorized");
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: error?.message || "Unauthorized", status: false, data: null });
  }
};

class TipoVisitaModel extends Model {
  id_tipo_visita;
  name;
  userCreatedAt;
  userUpdatedAt;
  createdAt;
  updatedAt;
}
TipoVisitaModel.init(
  {
    id_tipo_visita: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
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
    sequelize: sequelizeInit("PIOAPP"),
    tableName: "tipo_visita",
    schema: "app",
    timestamps: true
  }
);

var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let TipoVisitaRepository = class {
  async getAll(raw = false) {
    const result = await TipoVisitaModel.findAll({ raw });
    return result;
  }
};
TipoVisitaRepository = __decorateClass$7([
  injectable()
], TipoVisitaRepository);

var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$3 = (index, decorator) => (target, key) => decorator(target, key, index);
let TipoVisitasController = class {
  constructor(tipoVisitaRepository) {
    this.tipoVisitaRepository = tipoVisitaRepository;
  }
  async listAllTipoVisitas(req, res) {
    await handleSend(res, async (t) => {
      const result = await this.tipoVisitaRepository.getAll();
      return result;
    }, "Tipos visitas listados correctamente.");
  }
};
TipoVisitasController = __decorateClass$6([
  injectable(),
  __decorateParam$3(0, inject(TipoVisitaRepository))
], TipoVisitasController);

const tipoVisitasRouter = Router();
const tipoVisitasController = container.resolve(TipoVisitasController);
tipoVisitasRouter.use(authMiddleware);
tipoVisitasRouter.get("/all", tipoVisitasController.listAllTipoVisitas.bind(tipoVisitasController));

class TiendasModuloView extends Model {
  id_departamento;
  id_tienda;
  codigo_empresa;
  nombre_empresa;
  codigo_tienda;
  nombre_tienda;
  direccion_tienda;
  altitud;
  latitud;
  numero_establecimiento_sat;
  codigo_administrador;
  nombre_administrador;
  codigo_subadministrador;
  nombre_subadministrador;
  division;
  inactiva;
  nombre_lista_precio;
  listaPrecios;
  nombreComercial;
  nombre_menu;
  divisionNombre;
  celular;
  idSupervisor;
  administrador;
  afiliacionCredomatic;
  tipoMenu;
  createdAt;
  updatedAt;
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
    tipoMenu: { type: DataTypes.INTEGER, allowNull: true }
  },
  {
    sequelize: sequelizeInit("PDV"),
    tableName: "vwTiendasModulo",
    timestamps: false
  }
);

var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let TiendasModuloRepository = class {
  async getAll(raw = false) {
    const result = await TiendasModuloView.findAll({ raw });
    return result;
  }
};
TiendasModuloRepository = __decorateClass$5([
  injectable()
], TiendasModuloRepository);

var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$2 = (index, decorator) => (target, key) => decorator(target, key, index);
let TiendasModuloController = class {
  constructor(tiendasModuloRepository) {
    this.tiendasModuloRepository = tiendasModuloRepository;
  }
  async listAllTiendas(req, res) {
    await handleSend(res, async (t) => {
      const result = await this.tiendasModuloRepository.getAll();
      return result;
    }, "Tiendas listadas correctamente.");
  }
};
TiendasModuloController = __decorateClass$4([
  injectable(),
  __decorateParam$2(0, inject(TiendasModuloRepository))
], TiendasModuloController);

const tiendasModuloRouter = Router();
const tiendasModuloController = container.resolve(TiendasModuloController);
tiendasModuloRouter.use(authMiddleware);
tiendasModuloRouter.get("/all", tiendasModuloController.listAllTiendas.bind(tiendasModuloController));

class VisitaModel extends Model {
  id_visita;
  photo_gps_longitude;
  empresa;
  tienda;
  tienda_nombre;
  tienda_direccion;
  id_tipo_visita;
  photo_gps_latitude;
  phone_gps_longitude;
  phone_gps_latitude;
  name_original_image;
  url_image;
  id_form_supervision;
  comentario;
  userCreatedAt;
  userUpdatedAt;
  createdAt;
  updatedAt;
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
    userCreatedAt: { type: DataTypes.BIGINT, allowNull: true },
    userUpdatedAt: { type: DataTypes.BIGINT, allowNull: true }
  },
  {
    sequelize: sequelizeInit("PIOAPP"),
    tableName: "visita",
    schema: "app",
    timestamps: true
  }
);

var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let VisitaRepository = class {
  async create(data, t = null) {
    const result = await VisitaModel.create(data, { transaction: t });
    if (!result) throw new Error("Error al crear la visita.");
    return result;
  }
  async findByFilters(filters, raw = false) {
    const result = await VisitaModel.findAll({ where: filters, raw });
    return result;
  }
};
VisitaRepository = __decorateClass$3([
  injectable()
], VisitaRepository);

class FormSupervisionModel extends Model {
  id_form_supervision;
  uso_uniforme;
  buzon_cerrado;
  tienda_limpia;
  cantidad_personas;
  cantidad;
  name_original_photo_personas;
  url_photo_personas;
  userCreatedAt;
  userUpdatedAt;
  createdAt;
  updatedAt;
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
    userUpdatedAt: { type: DataTypes.BIGINT, allowNull: true }
  },
  {
    sequelize: sequelizeInit("PIOAPP"),
    tableName: "form_supervision",
    schema: "app",
    timestamps: true
  }
);

var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let FormSupervisionRepository = class {
  async create(data, t = null, raw = false) {
    const result = await FormSupervisionModel.create(data, { transaction: t });
    if (!result) throw new Error("Error al crear el formulario de supervision.");
    return raw ? result.get({ plain: true }) : result;
  }
};
FormSupervisionRepository = __decorateClass$2([
  injectable()
], FormSupervisionRepository);

function toBoolean(value) {
  return value === true || value === "true";
}

var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$1 = (index, decorator) => (target, key) => decorator(target, key, index);
let VisitasService = class {
  constructor(visitaRepository, formSupervisionRepository) {
    this.visitaRepository = visitaRepository;
    this.formSupervisionRepository = formSupervisionRepository;
  }
  async createVisitaAndSaveFile(t, data, user, file) {
    const insertFormSupervision = data.id_tipo_visita == 1 ? await this.formSupervisionRepository.create({ ...data, cantidad: !toBoolean(data?.cantidad_personas) ? null : data.cantidad }, t, true) : null;
    const insertVisita = await this.visitaRepository.create({ ...data, id_form_supervision: insertFormSupervision?.id_form_supervision || null, url_image: "prueba utl", userCreatedAt: user.id_users }, t);
    return insertVisita;
  }
  async filterVisitas() {
  }
};
VisitasService = __decorateClass$1([
  injectable(),
  __decorateParam$1(0, inject(VisitaRepository)),
  __decorateParam$1(1, inject(FormSupervisionRepository))
], VisitasService);

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
let VisitasController = class {
  constructor(visitasService) {
    this.visitasService = visitasService;
  }
  async createVisita(req, res) {
    await handleSend(res, async (t) => {
      const result = await this.visitasService.createVisitaAndSaveFile(
        t,
        req.body,
        req.user,
        req.files
      );
      return result;
    }, "Visitada creada correctamente.", true, "PIOAPP");
  }
};
VisitasController = __decorateClass([
  injectable(),
  __decorateParam(0, inject(VisitasService))
], VisitasController);

const CreateVisitaDto = yup.object({
  empresa: yup.string().required("la [empresa] es un campo obligatorio."),
  tienda: yup.string().required("la [tienda] es un campo obligatorio."),
  tienda_nombre: yup.string().required("la [tienda_nombre] es un campo obligatorio."),
  tienda_direccion: yup.string(),
  id_tipo_visita: yup.number().integer().required("el [id_tipo_visita] es un campo obligatorio."),
  photo_gps_longitude: yup.string(),
  photo_gps_latitude: yup.string(),
  phone_gps_longitude: yup.string().required("la [phone_gps_longitude] es un campo obligatorio."),
  phone_gps_latitude: yup.string().required("la [phone_gps_latitude] es un campo obligatorio."),
  name_original_image: yup.string(),
  comentario: yup.string(),
  //si id_tipo_visita es igual a 1 estos campos deberian enviarse si por default la db agarra false
  uso_uniforme: yup.boolean().when("id_tipo_visita", { is: 1, then: (schema) => schema.required("El [uso_uniforme] es un campo obligatorio."), otherwise: (schema) => schema }),
  buzon_cerrado: yup.boolean().when("id_tipo_visita", { is: 1, then: (schema) => schema.required("El [buzon_cerrado] es un campo obligatorio."), otherwise: (schema) => schema }),
  tienda_limpia: yup.boolean().when("id_tipo_visita", { is: 1, then: (schema) => schema.required("El [tienda_limpia] es un campo obligatorio."), otherwise: (schema) => schema }),
  cantidad_personas: yup.boolean().when("id_tipo_visita", { is: 1, then: (schema) => schema.required("El [cantidad_personas] es un campo obligatorio."), otherwise: (schema) => schema }),
  cantidad: yup.number(),
  name_original_photo_personas: yup.string()
});
const fileConfigVisitaDto = [
  {
    required: true,
    nameFormData: "foto_visita",
    maxFiles: 1,
    minFiles: 1,
    maxSize: 7,
    allowedTypes: ["image"]
    // maxSize: 
  },
  {
    required: false,
    nameFormData: "foto_personas",
    maxFiles: 1,
    // minFiles: 1,
    maxSize: 7,
    allowedTypes: ["image"]
    // maxSize: 
  }
];

const visitasRouter = Router();
const visitasController = container.resolve(VisitasController);
visitasRouter.use(authMiddleware);
visitasRouter.post("/create", validateFields(CreateVisitaDto, fileConfigVisitaDto), visitasController.createVisita.bind(visitasController));

const router = Router();
router.use("/auth", authRouter);
router.use("/tipo/visitas", tipoVisitasRouter);
router.use("/tiendas/modulo", tiendasModuloRouter);
router.use("/visitas", visitasRouter);

const errorHandlerMiddleware = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  const message = err.message || err.stack || "Internal Server Error";
  const status = err.status || 500;
  res.status(status).json({
    message,
    status: false,
    errors: err.errors || [message],
    data: null
  });
};

const app = express();
const PORT = process.env.PORT || 8e3;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/api", router);
app.use(errorHandlerMiddleware);
app.listen(PORT, () => {
  connectionDb();
  console.log(`Server running on http://localhost:${PORT}`);
});
