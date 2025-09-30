import 'reflect-metadata';
import express, { Router } from 'express';
import 'dotenv/config';
import { Sequelize, DataTypes, Model } from 'sequelize';
import { injectable, inject, container } from 'tsyringe';
import { genSalt, hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as yup from 'yup';

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

var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
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
tEmpleadoRepository = __decorateClass$8([
  injectable()
], tEmpleadoRepository);

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

var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
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
UsersRepository = __decorateClass$7([
  injectable()
], UsersRepository);

var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
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
CryptServices = __decorateClass$6([
  injectable()
], CryptServices);

const KEY = process.env.JWT_SECRET || "key1Secret";
const EXPIRE = "1h";
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

var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$3 = (index, decorator) => (target, key) => decorator(target, key, index);
let AuthServices = class {
  constructor(tEmpleadoRepo, usersRepository, cryptServices) {
    this.tEmpleadoRepo = tEmpleadoRepo;
    this.usersRepository = usersRepository;
    this.cryptServices = cryptServices;
  }
  async validLogin(data, t) {
    const empleado = await this.tEmpleadoRepo.findByCodigo(data.codigo, true, true);
    if (data.password !== empleado?.password) throw new Error("Contrase\xF1a incorrecta.");
    let user = await this.usersRepository.findById(data.codigo, false);
    if (!user) user = await this.usersRepository.createUser(
      {
        id_users: empleado.codEmpleado,
        id_rol: 1,
        first_name: empleado.nombreEmpleado,
        second_name: empleado.segundoNombre,
        first_last_name: empleado.apellidoEmpleado,
        second_last_name: empleado.segundoApellido,
        email: empleado.email,
        password: await this.cryptServices.Hash(empleado.password)
      },
      t
    );
    const { password, ...userJson } = user?.toJSON();
    const token = generateToken(userJson);
    const userData = { ...userJson, token };
    return userData;
  }
};
AuthServices = __decorateClass$5([
  injectable(),
  __decorateParam$3(0, inject(tEmpleadoRepository)),
  __decorateParam$3(1, inject(UsersRepository)),
  __decorateParam$3(2, inject(CryptServices))
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

var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$2 = (index, decorator) => (target, key) => decorator(target, key, index);
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
AuthController = __decorateClass$4([
  injectable(),
  __decorateParam$2(0, inject(AuthServices))
], AuthController);

const validateFields = (dto) => async (req, res, next) => {
  try {
    await dto.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errores = error?.errors || [];
    const textError = errores.join(", ");
    return res.status(400).json({ message: textError, status: false, errors: errores, data: null });
  }
};

const LoginDto = yup.object({
  codigo: yup.number().integer().required("el [codigo] es un campo obligatorio"),
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

var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
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
TipoVisitaRepository = __decorateClass$3([
  injectable()
], TipoVisitaRepository);

var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$1 = (index, decorator) => (target, key) => decorator(target, key, index);
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
TipoVisitasController = __decorateClass$2([
  injectable(),
  __decorateParam$1(0, inject(TipoVisitaRepository))
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

var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
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
TiendasModuloRepository = __decorateClass$1([
  injectable()
], TiendasModuloRepository);

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
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
TiendasModuloController = __decorateClass([
  injectable(),
  __decorateParam(0, inject(TiendasModuloRepository))
], TiendasModuloController);

const tiendasModuloRouter = Router();
const tiendasModuloController = container.resolve(TiendasModuloController);
tiendasModuloRouter.use(authMiddleware);
tiendasModuloRouter.get("/all", tiendasModuloController.listAllTiendas.bind(tiendasModuloController));

const router = Router();
router.use("/auth", authRouter);
router.use("/tipo/visitas", tipoVisitasRouter);
router.use("/tiendas/modulo", tiendasModuloRouter);

const app = express();
const PORT = process.env.PORT || 8e3;
app.use(express.json());
app.use("/api", router);
app.listen(PORT, () => {
  connectionDb();
  console.log(`Server running on http://localhost:${PORT}`);
});
