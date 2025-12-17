import 'reflect-metadata';
import express, { Router } from 'express';
import 'dotenv/config';
import { injectable, inject, container } from 'tsyringe';
import { genSalt, hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Sequelize, DataTypes, Model, Op, QueryTypes } from 'sequelize';
import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as yup from 'yup';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import sharp from 'sharp';
import * as crypto from 'crypto';
import path, { join } from 'path';
import { promises } from 'fs';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import http from 'http';
import { Server } from 'socket.io';

var __getOwnPropDesc$11 = Object.getOwnPropertyDescriptor;
var __decorateClass$11 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$11(target, key) : target;
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
CryptServices = __decorateClass$11([
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
      dialect: ENV.DB_CONNECTION,
      timezone: "America/Guatemala",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  },
  NOMINA: {
    database: ENV.DB_SECOND_DATABASE,
    username: ENV.DB_SECOND_USERNAME,
    password: ENV.DB_SECOND_PASSWORD,
    options: {
      host: ENV.DB_SECOND_HOST,
      port: ENV.DB_SECOND_PORT,
      dialect: ENV.DB_SECOND_CONNECTION,
      dialectOptions: {
        options: {
          encrypt: true,
          requestTimeout: 6e4
        }
      }
    }
  },
  GRUPOPINULITO: {
    database: ENV.DB_THIRD_DATABASE,
    username: ENV.DB_THIRD_USERNAME,
    password: ENV.DB_THIRD_PASSWORD,
    options: {
      host: ENV.DB_THIRD_HOST,
      port: ENV.DB_THIRD_PORT,
      dialect: ENV.DB_THIRD_CONNECTION,
      dialectOptions: {
        options: {
          encrypt: true,
          requestTimeout: 6e4
        }
      }
    }
  },
  PDV: {
    database: ENV.DB_FOURTH_DATABASE,
    username: ENV.DB_FOURTH_USERNAME,
    password: ENV.DB_FOURTH_PASSWORD,
    options: {
      host: ENV.DB_FOURTH_HOST,
      port: ENV.DB_FOURTH_PORT,
      dialect: ENV.DB_FOURTH_CONNECTION,
      dialectOptions: {
        options: {
          encrypt: true,
          requestTimeout: 6e4
        }
      }
    }
  }
};

const connections = {};
function sequelizeInit(instancia = DEFAULT_CONNECTION) {
  if (connections[instancia]) {
    return connections[instancia];
  }
  const dbConfig = configDatabase[instancia];
  const sequalize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig.options
  );
  connections[instancia] = sequalize;
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

class UsersModel extends Model {
  id_users;
  codigo_user;
  id_rol;
  first_name;
  second_name;
  first_last_name;
  second_last_name;
  email;
  password;
  dpi;
  fecha_nacimiento;
  direccion;
  puesto_trabajo;
  userCreatedAt;
  userUpdatedAt;
  createdAt;
  updatedAt;
}
UsersModel.init(
  {
    id_users: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false },
    codigo_user: { type: DataTypes.STRING(100), allowNull: false },
    id_rol: { type: DataTypes.INTEGER, allowNull: false },
    first_name: { type: DataTypes.STRING(500), allowNull: false },
    second_name: { type: DataTypes.STRING(500), allowNull: true },
    first_last_name: { type: DataTypes.STRING(500), allowNull: true },
    second_last_name: { type: DataTypes.STRING(500), allowNull: true },
    email: { type: DataTypes.STRING(500), allowNull: true },
    password: { type: DataTypes.TEXT, allowNull: false },
    dpi: { type: DataTypes.TEXT, allowNull: true },
    fecha_nacimiento: { type: DataTypes.DATE, allowNull: true },
    direccion: { type: DataTypes.STRING(500), allowNull: true },
    puesto_trabajo: { type: DataTypes.STRING(500), allowNull: true },
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

var __getOwnPropDesc$10 = Object.getOwnPropertyDescriptor;
var __decorateClass$10 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$10(target, key) : target;
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
UsersRepository = __decorateClass$10([
  injectable()
], UsersRepository);

var __getOwnPropDesc$$ = Object.getOwnPropertyDescriptor;
var __decorateClass$$ = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$$(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$A = (index, decorator) => (target, key) => decorator(target, key, index);
let UsersServices = class {
  constructor(usersRepository, cryptServices) {
    this.usersRepository = usersRepository;
    this.cryptServices = cryptServices;
  }
  async findOrCreateUserLogin(codigoEmpleado, empleado, t, json = false) {
    let user = await this.usersRepository.findById(codigoEmpleado, false);
    if (!user) user = await this.usersRepository.createUser(
      {
        id_users: empleado?.codEmpleado || null,
        codigo_user: empleado?.aliasCodigo || null,
        id_rol: empleado?.idRol || null,
        first_name: empleado?.nombreEmpleado || null,
        second_name: empleado?.segundoNombre || null,
        first_last_name: empleado?.apellidoEmpleado || null,
        second_last_name: empleado?.segundoApellido || null,
        email: empleado?.email || null,
        password: await this.cryptServices.Hash(empleado?.password || ""),
        dpi: empleado?.noDoc || null,
        fecha_nacimiento: empleado?.fechaNac || null,
        direccion: empleado?.direccion || null,
        puesto_trabajo: empleado?.nomPuesto || null
      },
      t
    );
    return json ? user?.toJSON() : user;
  }
};
UsersServices = __decorateClass$$([
  injectable(),
  __decorateParam$A(0, inject(UsersRepository)),
  __decorateParam$A(1, inject(CryptServices))
], UsersServices);

class DetalleEmpleadoCootraguaView extends Model {
  codEmpleado;
  nombreEmpleado;
  apellidoEmpleado;
  segundoNombre;
  segundoApellido;
  apellidoCasada;
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
  fechaNac_2;
  conyugue;
  noIGGS;
  numeroHijos;
  NIT;
  fechaVecIRTRA;
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
  noLicenGun;
  fechaVecLicenGun;
  noContract;
  venciTarjSal;
  venciTarjPul;
  venciTarjMan;
  codEmpleadoJefe;
  jefeInmediato;
  nombreEmpleadoCompleto;
  codEmpresa;
  nombreDepto;
  nombreEmpresa;
  password;
  codJefeDepto;
  activoContrato;
  profesion;
  activoEmpleado;
  aliasCodigo;
  nomContactEmerg;
  numContactEmerg;
  parenContactEmerg;
  tipoSangre;
  empleadoTrato;
  empresaTrato;
  fechaIngreso;
  fecha_ingreso_str;
  codDepto;
  nomPuesto;
  idRol;
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
    idRol: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize: sequelizeInit("NOMINA"),
    tableName: "vwDetalleEmpleadoCootragua",
    timestamps: false
  }
);

var __getOwnPropDesc$_ = Object.getOwnPropertyDescriptor;
var __decorateClass$_ = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$_(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let DetalleEmpleadoCootraguaViewRepository = class {
  async findByCodigo(codigo, error = true, raw = false) {
    const result = await DetalleEmpleadoCootraguaView.findByPk(codigo, { raw });
    if (error) {
      if (!result) throw new Error("Empleado no encontrado.");
    }
    return result;
  }
};
DetalleEmpleadoCootraguaViewRepository = __decorateClass$_([
  injectable()
], DetalleEmpleadoCootraguaViewRepository);

class TokenNotificationPushModel extends Model {
  id_token_notification_push;
  id_unique_device;
  id_users;
  exponent_push_token;
  userCreatedAt;
  userUpdatedAt;
  createdAt;
  updatedAt;
}
TokenNotificationPushModel.init(
  {
    id_token_notification_push: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_unique_device: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    id_users: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    exponent_push_token: {
      type: DataTypes.TEXT,
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
    tableName: "token_notification_push",
    schema: "app",
    timestamps: true
  }
);

class TokenNotificationPushRepository {
  async create(data, t = null, raw = false) {
    const result = await TokenNotificationPushModel.create(data, { transaction: t });
    if (!result) throw new Error(`Error al crear el Token Notificaciones.`);
    return raw ? result.get({ plain: true }) : result;
  }
  async upsertTokenNotificationPush(id_unique_device, data, t = null, raw = false) {
    const [item, created] = await TokenNotificationPushModel.findOrCreate({
      where: { id_unique_device },
      defaults: { ...data },
      transaction: t
    });
    if (!created) await item.update(data, { transaction: t });
    return raw ? item.get({ plain: true }) : item;
  }
  async countByIdUser(id_users) {
    const total = await TokenNotificationPushModel.count({
      where: { id_users }
    });
    return total;
  }
}

var __getOwnPropDesc$Z = Object.getOwnPropertyDescriptor;
var __decorateClass$Z = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$Z(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$z = (index, decorator) => (target, key) => decorator(target, key, index);
let AuthServices = class {
  constructor(cryptServices, usersServices, detalleEmpleadoCootraguaViewRepository, tokenNotificationPushRepository) {
    this.cryptServices = cryptServices;
    this.usersServices = usersServices;
    this.detalleEmpleadoCootraguaViewRepository = detalleEmpleadoCootraguaViewRepository;
    this.tokenNotificationPushRepository = tokenNotificationPushRepository;
  }
  async validLogin(data, t) {
    const { exponent_push_token, id_unique_device } = data;
    const codigoEmpleado = Number(data.codigo.substring(2));
    const empleado = await this.detalleEmpleadoCootraguaViewRepository.findByCodigo(codigoEmpleado, true, true);
    const user = await this.usersServices.findOrCreateUserLogin(codigoEmpleado, empleado, t, true);
    const resultCompare = await this.cryptServices.Compare(data.password, user?.password);
    if (!resultCompare) throw new Error("Contrase\xF1a incorrecta.");
    const { password, ...userJson } = user;
    if (id_unique_device && exponent_push_token && user?.id_users)
      await this.tokenNotificationPushRepository.upsertTokenNotificationPush(
        id_unique_device,
        { id_unique_device, exponent_push_token, id_users: Number(user.id_users) },
        t
      );
    const token = generateToken(userJson);
    const userData = { ...userJson, token };
    return userData;
  }
};
AuthServices = __decorateClass$Z([
  injectable(),
  __decorateParam$z(0, inject(CryptServices)),
  __decorateParam$z(1, inject(UsersServices)),
  __decorateParam$z(2, inject(DetalleEmpleadoCootraguaViewRepository)),
  __decorateParam$z(3, inject(TokenNotificationPushRepository))
], AuthServices);

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    //mostrar por consola
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    /*
    guardar dentro de archivos por dia maximo de tamaño para cada archivo es de 10mb 
    y los archivos con antiguedad mayor a 30 dias se eliminan
    */
    new DailyRotateFile({
      filename: "src/storage/logs/%DATE%-app.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "30d",
      zippedArchive: true
    })
  ]
});

async function handleSend(res, callback = async () => {
}, messageSuccess = "", isWithRollBack = false, connection = DEFAULT_CONNECTION, isFile = false, commitController = false) {
  let t;
  if (isWithRollBack) t = await sequelizeInit(connection).transaction();
  try {
    let result = null;
    result = await callback(t);
    if (isWithRollBack && !commitController) t && await t.commit();
    return isFile ? result : res.status(200).json({ message: messageSuccess, status: true, data: result });
  } catch (error) {
    if (isWithRollBack) t && await t.rollback();
    const message = error?.message || error?.stack;
    logger.error("Error en handleSend", {
      type: "handle",
      message,
      stack: error?.stack,
      name: error?.name,
      isWithRollBack,
      connection,
      commitController,
      errorRaw: error
    });
    return res.status(500).json({ message: message ?? "Error server internal", status: false, data: null });
  }
}

var __getOwnPropDesc$Y = Object.getOwnPropertyDescriptor;
var __decorateClass$Y = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$Y(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$y = (index, decorator) => (target, key) => decorator(target, key, index);
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
AuthController = __decorateClass$Y([
  injectable(),
  __decorateParam$y(0, inject(AuthServices))
], AuthController);

const injectParamsToBody = (req) => {
  const hasParams = req.params && Object.keys(req.params).length > 0;
  const hasQuery = req.query && Object.keys(req.query).length > 0;
  if (hasParams || hasQuery) {
    req.body = {
      ...req.body,
      ...hasParams ? req.params : {},
      ...hasQuery ? req.query : {}
    };
  }
};

function BYTE(mb = 0) {
  return mb * 1024 * 1024;
}

const validateFileType = (file, allowedTypes, fileName) => {
  if (!allowedTypes || allowedTypes.length === 0) return;
  const mime = file.mimetype;
  const isImage = mime.startsWith("image/");
  const isPdf = mime === "application/pdf";
  const isValidType = allowedTypes.includes("image") && isImage || allowedTypes.includes("pdf") && isPdf;
  if (!isValidType) {
    throw new Error(`El archivo [${fileName}] tiene un formato no permitido. Solo se aceptan: ${allowedTypes.join(", ")}.`);
  }
};
const validateFileSize = (file, config) => {
  const { minSize, maxSize } = config;
  const fileName = file.name;
  if (minSize && file.size < BYTE(minSize)) {
    throw new Error(`El archivo [${fileName}] es muy peque\xF1o. Tama\xF1o m\xEDnimo: ${minSize} MB.`);
  }
  if (maxSize && file.size > BYTE(maxSize)) {
    throw new Error(`El archivo [${fileName}] es demasiado grande. Tama\xF1o m\xE1ximo: ${maxSize} MB.`);
  }
};
const validateFileCount = (files, config) => {
  const { minFiles, maxFiles } = config;
  if (minFiles && files.length < minFiles) {
    throw new Error(`Debes subir al menos ${minFiles} archivo(s). Subidos: ${files.length}.`);
  }
  if (maxFiles && files.length > maxFiles) {
    throw new Error(`Solo puedes subir un m\xE1ximo de ${maxFiles} archivo(s). Intentaste subir: ${files.length}.`);
  }
};
const getFilesFromRequest = (req, fieldName) => {
  const fileEntry = (req?.files ?? {})[fieldName] ?? null;
  return Array.isArray(fileEntry) ? fileEntry : fileEntry ? [fileEntry] : [];
};
const validateFileConfig = (req, config) => {
  const { nameFormData, required = false } = config;
  const files = getFilesFromRequest(req, nameFormData);
  const hasFiles = files.length > 0;
  if (required && !hasFiles) {
    throw new Error(`El campo [${nameFormData}] es obligatorio.`);
  }
  if (!required && !hasFiles) return;
  validateFileCount(files, config);
  files.forEach((file) => {
    validateFileSize(file, config);
    validateFileType(file, config.allowedTypes || [], file.name);
  });
};
const validateFiles = (req, configFiles) => {
  configFiles.forEach((config) => validateFileConfig(req, config));
};

const formatErrorResponse = (error) => {
  const errores = error?.errors || [];
  const textError = errores.join(", ") || error?.message || error?.stack || "Error middleware validate Fields (message not found.)";
  return {
    message: textError,
    status: false,
    errors: errores,
    data: null
  };
};

const validateFields = (dto, configFiles = null, injectParams = false) => async (req, res, next) => {
  try {
    if (injectParams) {
      injectParamsToBody(req);
    }
    await dto.validate(req.body, { abortEarly: false });
    if (configFiles) {
      validateFiles(req, configFiles);
    }
    next();
  } catch (error) {
    logger.error("Error en middleware de validacion de entrada de datos.", {
      type: "fields",
      message: "",
      stack: error?.stack,
      name: error?.name,
      isWithRollBack: false,
      connection: null,
      commitController: false,
      errorRaw: error
    });
    const errorResponse = formatErrorResponse(error);
    return res.status(400).json(errorResponse);
  }
};

const LoginDto = yup.object({
  // codigo: yup.number().integer().required('el [codigo] es un campo obligatorio'),
  codigo: yup.string().matches(/^[a-zA-Z]{2}\d+$/, "el [codigo] debe empezar con 2 letra y luego numeros.").required("el [codigo] es un campo obligatorio"),
  password: yup.string().required("el [password] es un campo obligatorio"),
  id_unique_device: yup.string().nullable(),
  exponent_push_token: yup.string().nullable()
}).test(
  "device-and-push-token",
  "id_unique_device y exponent_push_token deben enviarse juntos",
  function(values) {
    const { id_unique_device, exponent_push_token } = values ?? {};
    const hasDevice = !!id_unique_device;
    const hasToken = !!exponent_push_token;
    return hasDevice === hasToken;
  }
);

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
    logger.error("Error en middleware de autenticacion.", {
      type: "auth",
      message: "",
      stack: error?.stack,
      name: error?.name,
      isWithRollBack: false,
      connection: null,
      commitController: false,
      errorRaw: error
    });
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

var __getOwnPropDesc$X = Object.getOwnPropertyDescriptor;
var __decorateClass$X = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$X(target, key) : target;
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
TipoVisitaRepository = __decorateClass$X([
  injectable()
], TipoVisitaRepository);

class ResumenPermissionTipoVisitaView extends Model {
  id_permission_tipo_visita;
  id_tipo_visita;
  name;
  id_rol;
  name_rol;
}
ResumenPermissionTipoVisitaView.init(
  {
    id_permission_tipo_visita: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_tipo_visita: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name_rol: {
      type: DataTypes.STRING(250),
      allowNull: false
    }
  },
  {
    tableName: "vwResumenPermissionTipoVisita",
    schema: "app",
    sequelize: sequelizeInit("PIOAPP"),
    timestamps: false
  }
);

var __getOwnPropDesc$W = Object.getOwnPropertyDescriptor;
var __decorateClass$W = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$W(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let ResumenPermissionTipoVisitaViewRepository = class {
  async getByRol(id_rol, raw = false) {
    const result = await ResumenPermissionTipoVisitaView.findAll({
      attributes: ["id_tipo_visita", "name"],
      where: { id_rol },
      raw
    });
    return result;
  }
};
ResumenPermissionTipoVisitaViewRepository = __decorateClass$W([
  injectable()
], ResumenPermissionTipoVisitaViewRepository);

var __getOwnPropDesc$V = Object.getOwnPropertyDescriptor;
var __decorateClass$V = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$V(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$x = (index, decorator) => (target, key) => decorator(target, key, index);
let TipoVisitasController = class {
  constructor(tipoVisitaRepository, resumenPermissionTipoVisitaViewRepository) {
    this.tipoVisitaRepository = tipoVisitaRepository;
    this.resumenPermissionTipoVisitaViewRepository = resumenPermissionTipoVisitaViewRepository;
  }
  async listAllTipoVisitas(req, res) {
    await handleSend(res, async (t) => {
      const result = await this.resumenPermissionTipoVisitaViewRepository.getByRol(req.user?.id_rol ?? 0);
      return result;
    }, "Tipos visitas listados correctamente.");
  }
};
TipoVisitasController = __decorateClass$V([
  injectable(),
  __decorateParam$x(0, inject(TipoVisitaRepository)),
  __decorateParam$x(1, inject(ResumenPermissionTipoVisitaViewRepository))
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

var __getOwnPropDesc$U = Object.getOwnPropertyDescriptor;
var __decorateClass$U = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$U(target, key) : target;
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
TiendasModuloRepository = __decorateClass$U([
  injectable()
], TiendasModuloRepository);

var __getOwnPropDesc$T = Object.getOwnPropertyDescriptor;
var __decorateClass$T = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$T(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$w = (index, decorator) => (target, key) => decorator(target, key, index);
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
TiendasModuloController = __decorateClass$T([
  injectable(),
  __decorateParam$w(0, inject(TiendasModuloRepository))
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
  google_maps_url;
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
    google_maps_url: { type: DataTypes.TEXT, allowNull: false },
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

var __getOwnPropDesc$S = Object.getOwnPropertyDescriptor;
var __decorateClass$S = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$S(target, key) : target;
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
  async getAll(raw = false) {
    const result = await VisitaModel.findAll({ raw });
    return result;
  }
};
VisitaRepository = __decorateClass$S([
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

var __getOwnPropDesc$R = Object.getOwnPropertyDescriptor;
var __decorateClass$R = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$R(target, key) : target;
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
FormSupervisionRepository = __decorateClass$R([
  injectable()
], FormSupervisionRepository);

function toBoolean(value) {
  return value === true || value === "true";
}

const client = new S3Client({
  region: `${process.env.AWS_BUCKET_REGION}`,
  credentials: {
    accessKeyId: `${process.env.AWS_PUBLIC_KEY}`,
    secretAccessKey: `${process.env.AWS_SECRET_KEY}`
  }
});

var __getOwnPropDesc$Q = Object.getOwnPropertyDescriptor;
var __decorateClass$Q = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$Q(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let SharpServices = class {
  constructor() {
  }
  async optimizedFileBuffer(file) {
    let dataOptimized = file.data;
    if (file.mimetype === "image/png")
      dataOptimized = await sharp(file.data).rotate().resize({ width: 2e3, withoutEnlargement: true }).png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true
      }).toBuffer();
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg")
      dataOptimized = await sharp(file.data).rotate().resize({ width: 2e3, withoutEnlargement: true }).jpeg({
        quality: 85,
        //95
        mozjpeg: true,
        chromaSubsampling: "4:2:0"
      }).toBuffer();
    return dataOptimized;
  }
};
SharpServices = __decorateClass$Q([
  injectable()
], SharpServices);

var __getOwnPropDesc$P = Object.getOwnPropertyDescriptor;
var __decorateClass$P = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$P(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$v = (index, decorator) => (target, key) => decorator(target, key, index);
let FileServices = class {
  constructor(sharpServices) {
    this.sharpServices = sharpServices;
  }
  async fileUploadSingle(file, carpeta = "visitas") {
    try {
      if (!file) throw new Error("No se recibio ningun archivo.");
      const nameFile = `${carpeta}/${v4()}-${file?.name || "default"}`;
      const optimizedData = await this.sharpServices.optimizedFileBuffer(file);
      const command = new PutObjectCommand({
        Bucket: `${process.env.AWS_BUCKET_NAME}`,
        Key: `${nameFile}`,
        Body: optimizedData,
        ContentType: file.mimetype
      });
      const result = await client.send(command);
      if (result.$metadata.httpStatusCode != 200) throw new Error("Error al subir la imagen (Servicio S3).");
      return {
        nameFileKey: nameFile,
        urlS3: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${nameFile}`
      };
    } catch (error) {
      throw error;
    }
  }
};
FileServices = __decorateClass$P([
  injectable(),
  __decorateParam$v(0, inject(SharpServices))
], FileServices);

var __getOwnPropDesc$O = Object.getOwnPropertyDescriptor;
var __decorateClass$O = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$O(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$u = (index, decorator) => (target, key) => decorator(target, key, index);
let VisitasService = class {
  constructor(visitaRepository, formSupervisionRepository, fileServices) {
    this.visitaRepository = visitaRepository;
    this.formSupervisionRepository = formSupervisionRepository;
    this.fileServices = fileServices;
  }
  async createVisitaAndSaveFile(t, data, user, file) {
    const resultUploadPhotoVisita = await this.fileServices.fileUploadSingle(file.foto_visita, "visitas");
    const resultUploadPhotoPersonas = file.foto_personas ? await this.fileServices.fileUploadSingle(file.foto_personas, "visitas") : null;
    const insertFormSupervision = data.id_tipo_visita == 1 ? await this.formSupervisionRepository.create({ ...data, url_photo_personas: resultUploadPhotoPersonas?.urlS3 || null, cantidad: !toBoolean(data?.cantidad_personas) ? null : data.cantidad }, t, true) : null;
    const insertVisita = await this.visitaRepository.create({ ...data, google_maps_url: `https://www.google.com/maps/search/?api=1&query=${data.phone_gps_latitude},${data.phone_gps_longitude}`, id_form_supervision: insertFormSupervision?.id_form_supervision || null, url_image: resultUploadPhotoVisita.urlS3, userCreatedAt: user.id_users }, t);
    return insertVisita;
  }
  async filterVisitas() {
  }
};
VisitasService = __decorateClass$O([
  injectable(),
  __decorateParam$u(0, inject(VisitaRepository)),
  __decorateParam$u(1, inject(FormSupervisionRepository)),
  __decorateParam$u(2, inject(FileServices))
], VisitasService);

var __getOwnPropDesc$N = Object.getOwnPropertyDescriptor;
var __decorateClass$N = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$N(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$t = (index, decorator) => (target, key) => decorator(target, key, index);
let VisitasController = class {
  constructor(visitasService, visitaRepository) {
    this.visitasService = visitasService;
    this.visitaRepository = visitaRepository;
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
  async listAllVisitas(req, res) {
    await handleSend(res, async () => {
      const result = await this.visitaRepository.getAll();
      return result;
    }, "Visitas listadas correctamente.");
  }
};
VisitasController = __decorateClass$N([
  injectable(),
  __decorateParam$t(0, inject(VisitasService)),
  __decorateParam$t(1, inject(VisitaRepository))
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
visitasRouter.get("/list/all", visitasController.listAllVisitas.bind(visitasController));

var __getOwnPropDesc$M = Object.getOwnPropertyDescriptor;
var __decorateClass$M = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$M(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let JwtService = class {
  constructor() {
  }
  async verifyJwtToken(data) {
    const resultValidate = await verifyToken(data.tokenText);
    if (!resultValidate) throw new Error("Error token no valido.");
    return resultValidate;
  }
};
JwtService = __decorateClass$M([
  injectable()
], JwtService);

var __getOwnPropDesc$L = Object.getOwnPropertyDescriptor;
var __decorateClass$L = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$L(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$s = (index, decorator) => (target, key) => decorator(target, key, index);
let JwtController = class {
  constructor(jwtService) {
    this.jwtService = jwtService;
  }
  async validJwt(req, res) {
    await handleSend(res, async () => {
      const result = await this.jwtService.verifyJwtToken(req.body);
      return result;
    }, "Token validado.");
  }
};
JwtController = __decorateClass$L([
  injectable(),
  __decorateParam$s(0, inject(JwtService))
], JwtController);

const ValidJwtDto = yup.object({
  tokenText: yup.string().required("el [tokenText] es un campo obligatorio.")
});

const jwtRouter = Router();
const jwtController = container.resolve(JwtController);
jwtRouter.post("/valid", validateFields(ValidJwtDto), jwtController.validJwt.bind(jwtController));

class ResumenPermissionMenuView extends Model {
  id_permission_menu;
  id_rol;
  name_rol;
  id_menu_app;
  name_route;
  title;
  id_categorias_menu;
  name_category;
  id_type_menu;
  name_type_menu;
}
ResumenPermissionMenuView.init(
  {
    id_permission_menu: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    id_rol: { type: DataTypes.INTEGER, allowNull: false },
    name_rol: { type: DataTypes.STRING(500), allowNull: false },
    id_menu_app: { type: DataTypes.INTEGER, allowNull: false },
    name_route: { type: DataTypes.STRING(500), allowNull: false },
    title: { type: DataTypes.STRING(500), allowNull: false },
    id_categorias_menu: { type: DataTypes.INTEGER, allowNull: false },
    name_category: { type: DataTypes.STRING(500), allowNull: false },
    id_type_menu: { type: DataTypes.INTEGER, allowNull: false },
    name_type_menu: { type: DataTypes.STRING(500), allowNull: false }
  },
  {
    sequelize: sequelizeInit("PIOAPP"),
    timestamps: false,
    tableName: "vwResumenPermissionMenu",
    schema: "app"
  }
);

var __getOwnPropDesc$K = Object.getOwnPropertyDescriptor;
var __decorateClass$K = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$K(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let ResumenPermissionMenuViewRepository = class {
  async getPermissionByRol(rol, raw = false) {
    const result = await ResumenPermissionMenuView.findAll({ where: { id_rol: rol }, raw });
    return result;
  }
};
ResumenPermissionMenuViewRepository = __decorateClass$K([
  injectable()
], ResumenPermissionMenuViewRepository);

var __getOwnPropDesc$J = Object.getOwnPropertyDescriptor;
var __decorateClass$J = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$J(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$r = (index, decorator) => (target, key) => decorator(target, key, index);
let PermissionController = class {
  constructor(resumenPermissionMenuViewRepository) {
    this.resumenPermissionMenuViewRepository = resumenPermissionMenuViewRepository;
  }
  async findMenusByRol(req, res) {
    await handleSend(res, async () => {
      const result = await this.resumenPermissionMenuViewRepository.getPermissionByRol(req.user?.id_rol ?? 0);
      return result;
    }, "Permisos listados correctamente.");
  }
};
PermissionController = __decorateClass$J([
  injectable(),
  __decorateParam$r(0, inject(ResumenPermissionMenuViewRepository))
], PermissionController);

const permissionRouter = Router();
const permissionController = container.resolve(PermissionController);
permissionRouter.use(authMiddleware);
permissionRouter.get("/all", permissionController.findMenusByRol.bind(permissionController));

class RutasView extends Model {
  // public id!: number;
  id_pedido;
  empresa;
  tienda;
  fecha_entrega;
  piloto;
  no_ruta;
  nombre_ruta;
  cede;
  id_tipo_entrega;
  name_tipo_entrega;
  tienda_nombre;
  tienda_direccion;
  serie;
  codigo_empleado_piloto;
  recepccionada;
}
RutasView.init(
  {
    // id: { type: DataTypes.BIGINT, primaryKey: true },
    id_pedido: { type: DataTypes.INTEGER, allowNull: true, primaryKey: true },
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
    serie: { type: DataTypes.STRING(100), allowNull: true, primaryKey: true },
    codigo_empleado_piloto: { type: DataTypes.INTEGER, allowNull: true },
    recepccionada: { type: DataTypes.INTEGER, allowNull: true }
  },
  {
    sequelize: sequelizeInit("GRUPOPINULITO"),
    tableName: "vwRutas",
    timestamps: false
  }
);

var __getOwnPropDesc$I = Object.getOwnPropertyDescriptor;
var __decorateClass$I = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$I(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let RutasViewRepository = class {
  async findRutaByPedido(id_pedido, error = true, raw = false) {
    const ruta = await RutasView.findOne({ where: { id_pedido }, raw });
    if (error) {
      if (!ruta) throw new Error("Ruta no encontrada.");
    }
    return ruta;
  }
  async getAllRutasByFilters(filters, raw = false) {
    const result = await RutasView.findAll({
      where: { ...filters },
      order: [
        ["id_pedido", "DESC"],
        ["serie", "DESC"]
      ],
      raw
    });
    return result;
  }
  async getTiendasByDate(date, codigo_empleado_piloto, raw = false) {
    const result = await RutasView.findAll({
      attributes: ["empresa", "tienda", "tienda_nombre"],
      group: ["empresa", "tienda", "tienda_nombre"],
      where: {
        fecha_entrega: date,
        codigo_empleado_piloto
      },
      raw
    });
    return result;
  }
  async findRutaByIdPedidoAndSerie(id_pedido, serie, raw = false) {
    const result = await RutasView.findOne({ where: { id_pedido, serie }, raw });
    if (!result) throw new Error(`Error no se encontro ninguna ruta con este pedido: ${id_pedido} y serie ${serie}.`);
    return result;
  }
};
RutasViewRepository = __decorateClass$I([
  injectable()
], RutasViewRepository);

var __getOwnPropDesc$H = Object.getOwnPropertyDescriptor;
var __decorateClass$H = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$H(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$q = (index, decorator) => (target, key) => decorator(target, key, index);
let RutasViewService = class {
  constructor(rutasViewRepository) {
    this.rutasViewRepository = rutasViewRepository;
  }
  async filterRutas(data, user) {
    const empresaData = data?.empresa || "";
    const tiendaData = data?.tienda || "";
    const listRutas = await this.rutasViewRepository.getAllRutasByFilters({
      fecha_entrega: data.fecha_entrega,
      codigo_empleado_piloto: Number(user.id_users),
      ...empresaData ? { empresa: empresaData } : {},
      ...tiendaData ? { tienda: tiendaData } : {}
      // codigo_empleado_piloto: 3657
    });
    return listRutas;
  }
  async groupTiendasRutasByDate(data, user) {
    const tiendaGroup = await this.rutasViewRepository.getTiendasByDate(
      data.fecha_entrega,
      Number(user.id_users)
    );
    return tiendaGroup;
  }
};
RutasViewService = __decorateClass$H([
  injectable(),
  __decorateParam$q(0, inject(RutasViewRepository))
], RutasViewService);

var __getOwnPropDesc$G = Object.getOwnPropertyDescriptor;
var __decorateClass$G = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$G(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$p = (index, decorator) => (target, key) => decorator(target, key, index);
let RutasViewController = class {
  constructor(rutasViewService) {
    this.rutasViewService = rutasViewService;
  }
  async listAllByCodigoEmpleado(req, res) {
    await handleSend(res, async () => {
      const result = await this.rutasViewService.filterRutas(
        req.body,
        req.user
      );
      return result;
    }, "Rutas por usuario listadas correctamente.");
  }
  async listTiendasByFecha(req, res) {
    await handleSend(res, async () => {
      const result = await this.rutasViewService.groupTiendasRutasByDate(
        req.body,
        req.user
      );
      return result;
    }, "Tiendas rutas listadas correctamente.");
  }
};
RutasViewController = __decorateClass$G([
  injectable(),
  __decorateParam$p(0, inject(RutasViewService))
], RutasViewController);

const ListRutasFilterDto = yup.object({
  empresa: yup.string(),
  tienda: yup.string(),
  fecha_entrega: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, "La [fecha_entrega] debe tener el formato YYYY-MM-DD").required("La [fecha_entrega] es un campo obligatorio.")
});

const ListTiendasDateDto = yup.object({
  fecha_entrega: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, "La [fecha_entrega] debe tener el formato YYYY-MM-DD").required("La [fecha_entrega] es un campo obligatorio.")
});

const rutasViewRouter = Router();
const rutasViewController = container.resolve(RutasViewController);
rutasViewRouter.use(authMiddleware);
rutasViewRouter.get("/list", validateFields(ListRutasFilterDto, null, true), rutasViewController.listAllByCodigoEmpleado.bind(rutasViewController));
rutasViewRouter.get("/tiendas/rutas", validateFields(ListTiendasDateDto, null, true), rutasViewController.listTiendasByFecha.bind(rutasViewController));

class ArticulosRutaView extends Model {
  // public id!: number;
  id_pedido;
  codigo_articulo;
  nombre_articulo;
  description;
  cantidad;
  serie;
}
ArticulosRutaView.init(
  {
    // id: { type: DataTypes.BIGINT, primaryKey: true },
    id_pedido: { type: DataTypes.INTEGER, allowNull: true, primaryKey: true },
    codigo_articulo: { type: DataTypes.STRING(500), allowNull: true, primaryKey: true },
    nombre_articulo: { type: DataTypes.STRING(500), allowNull: true },
    description: { type: DataTypes.STRING(500), allowNull: true },
    cantidad: { type: DataTypes.FLOAT, allowNull: true },
    serie: { type: DataTypes.STRING(100), allowNull: true, primaryKey: true }
  },
  {
    sequelize: sequelizeInit("GRUPOPINULITO"),
    tableName: "vwArticulosRuta",
    timestamps: false
  }
);

var __getOwnPropDesc$F = Object.getOwnPropertyDescriptor;
var __decorateClass$F = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$F(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let ArticulosRutaViewRepository = class {
  async getAllByPedido(id_pedido, raw = false) {
    const articulos = await ArticulosRutaView.findAll({ where: { id_pedido }, raw });
    return articulos;
  }
  async getAllByPedidoAndSerie(id_pedido, serie, raw = false) {
    const result = await ArticulosRutaView.findAll({
      where: { id_pedido, serie },
      order: [["codigo_articulo", "DESC"]],
      raw
    });
    return result;
  }
};
ArticulosRutaViewRepository = __decorateClass$F([
  injectable()
], ArticulosRutaViewRepository);

var __getOwnPropDesc$E = Object.getOwnPropertyDescriptor;
var __decorateClass$E = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$E(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$o = (index, decorator) => (target, key) => decorator(target, key, index);
let ArticulosRutaService = class {
  constructor(rutasViewRepository, articulosRutaViewRepository) {
    this.rutasViewRepository = rutasViewRepository;
    this.articulosRutaViewRepository = articulosRutaViewRepository;
  }
  async getListArtExternalServicePOS(data) {
    const ruta = await this.rutasViewRepository.findRutaByIdPedidoAndSerie(data.id_pedido, data.serie, true);
    if (ruta?.recepccionada != 0)
      throw new Error(`Opps. La boleta ya fue recepccionada en la tienda ${ruta?.tienda_nombre || " -- "}`);
    const resultArticulosRecepccion = await this.articulosRutaViewRepository.getAllByPedidoAndSerie(
      data.id_pedido,
      data.serie
    );
    const resultJsonRecepccion = {
      cabecera: ruta,
      detalle: resultArticulosRecepccion
    };
    return resultJsonRecepccion;
  }
};
ArticulosRutaService = __decorateClass$E([
  injectable(),
  __decorateParam$o(0, inject(RutasViewRepository)),
  __decorateParam$o(1, inject(ArticulosRutaViewRepository))
], ArticulosRutaService);

var __getOwnPropDesc$D = Object.getOwnPropertyDescriptor;
var __decorateClass$D = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$D(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$n = (index, decorator) => (target, key) => decorator(target, key, index);
let ArticulosRutaController = class {
  constructor(articulosRutaViewRepository, articulosRutaService) {
    this.articulosRutaViewRepository = articulosRutaViewRepository;
    this.articulosRutaService = articulosRutaService;
  }
  async listArticulosRuta(req, res) {
    await handleSend(res, async () => {
      const result = await this.articulosRutaViewRepository.getAllByPedidoAndSerie(
        req.body.id_pedido,
        req.body.serie
      );
      return result;
    }, "Articulos listados correctamente.");
  }
  async listEntradaArticulosTiendaPOS(req, res) {
    await handleSend(res, async () => {
      const result = await this.articulosRutaService.getListArtExternalServicePOS(req.body);
      return result;
    }, "Articulos Entrada listados correctamente.");
  }
};
ArticulosRutaController = __decorateClass$D([
  injectable(),
  __decorateParam$n(0, inject(ArticulosRutaViewRepository)),
  __decorateParam$n(1, inject(ArticulosRutaService))
], ArticulosRutaController);

const PedidosRutaDto = yup.object({
  id_pedido: yup.number().required("El [id_pedido] es un campo obligatorio."),
  serie: yup.string().required("La [serie] es un campo obligatorio.")
});

const ListArticulosRutaDto = yup.object({
  serie: yup.string().required("La [serie] es un campo obligatorio."),
  id_pedido: yup.number().required("EL [id_pedido] es un campo obligatorio.")
});

const articulosRutaRouter = Router();
const articulosRutaController = container.resolve(ArticulosRutaController);
articulosRutaRouter.use(authMiddleware);
articulosRutaRouter.get(
  "/list",
  validateFields(PedidosRutaDto, null, true),
  articulosRutaController.listArticulosRuta.bind(articulosRutaController)
);
articulosRutaRouter.get(
  "/list/POS",
  validateFields(ListArticulosRutaDto, null, true),
  articulosRutaController.listEntradaArticulosTiendaPOS.bind(articulosRutaController)
);

class tPeriodoModel extends Model {
}
tPeriodoModel.init(
  {
    idPeriodo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombrePeriodo: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    fechaInicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fechaFin: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    pagada: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    noQuincena: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  },
  {
    sequelize: sequelizeInit("NOMINA"),
    tableName: "tPeriodo",
    schema: "dbo",
    timestamps: false
    // SQL Server no tiene createdAt/updatedAt automáticos
  }
);

var __getOwnPropDesc$C = Object.getOwnPropertyDescriptor;
var __decorateClass$C = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$C(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let tPeriodoRepository = class {
  async findById(idPeriodo, raw = false) {
    const result = await tPeriodoModel.findByPk(idPeriodo, { raw });
    return result;
  }
  async findByActive(activo = true, raw = false) {
    const result = await tPeriodoModel.findAll({
      where: { activo },
      order: [["fechaInicio", "DESC"]],
      raw
    });
    return result;
  }
  async findByPagada(pagada = false, raw = false) {
    const result = await tPeriodoModel.findAll({
      where: { pagada },
      order: [["fechaInicio", "DESC"]],
      raw
    });
    return result;
  }
  async findCurrentPeriodo(raw = false) {
    const today = /* @__PURE__ */ new Date();
    const result = await tPeriodoModel.findOne({
      where: {
        activo: true,
        fechaInicio: { [Op.lte]: today },
        fechaFin: { [Op.gte]: today }
      },
      raw
    });
    return result;
  }
  async findByDateRange(fechaInicio, fechaFin, raw = false) {
    const result = await tPeriodoModel.findAll({
      where: {
        [Op.or]: [
          {
            fechaInicio: { [Op.between]: [fechaInicio, fechaFin] }
          },
          {
            fechaFin: { [Op.between]: [fechaInicio, fechaFin] }
          }
        ]
      },
      order: [["fechaInicio", "DESC"]],
      raw
    });
    return result;
  }
  async findByQuincena(noQuincena, raw = false) {
    const result = await tPeriodoModel.findAll({
      where: { noQuincena },
      order: [["fechaInicio", "DESC"]],
      raw
    });
    return result;
  }
  async marcarComoPagada(idPeriodo) {
    const [affectedRows] = await tPeriodoModel.update(
      { pagada: true },
      { where: { idPeriodo } }
    );
    return affectedRows > 0;
  }
  async activarPeriodo(idPeriodo) {
    const [affectedRows] = await tPeriodoModel.update(
      { activo: true },
      { where: { idPeriodo } }
    );
    return affectedRows > 0;
  }
  async desactivarPeriodo(idPeriodo) {
    const [affectedRows] = await tPeriodoModel.update(
      { activo: false },
      { where: { idPeriodo } }
    );
    return affectedRows > 0;
  }
  async getAll(raw = false) {
    const result = await tPeriodoModel.findAll({
      order: [["fechaInicio", "DESC"]],
      raw
    });
    return result;
  }
  async findUltimosPeriodosPagados(limite = 10, raw = false) {
    const result = await tPeriodoModel.findAll({
      where: {
        pagada: true,
        activo: true
      },
      order: [["fechaInicio", "DESC"]],
      limit: limite,
      raw
    });
    return result;
  }
};
tPeriodoRepository = __decorateClass$C([
  injectable()
], tPeriodoRepository);

var __getOwnPropDesc$B = Object.getOwnPropertyDescriptor;
var __decorateClass$B = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$B(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$m = (index, decorator) => (target, key) => decorator(target, key, index);
let PeriodoService = class {
  constructor(tPeriodoRepository2) {
    this.tPeriodoRepository = tPeriodoRepository2;
  }
  /**
   * Obtener los últimos periodos pagados
   */
  async obtenerUltimosPeriodosPagados(limite = 5) {
    const periodos = await this.tPeriodoRepository.findUltimosPeriodosPagados(limite, true);
    return periodos.map((periodo) => ({
      idPeriodo: periodo.idPeriodo,
      nombrePeriodo: periodo.nombrePeriodo,
      fechaInicio: periodo.fechaInicio,
      fechaFin: periodo.fechaFin,
      pagada: periodo.pagada,
      noQuincena: periodo.noQuincena,
      activo: periodo.activo
    }));
  }
  /**
   * Obtener un periodo por ID
   */
  async obtenerPeriodoPorId(idPeriodo) {
    return await this.tPeriodoRepository.findById(idPeriodo);
  }
  /**
   * Verificar si un periodo está pagado
   */
  async verificarPeriodoPagado(idPeriodo) {
    const periodo = await this.tPeriodoRepository.findById(idPeriodo);
    if (!periodo) {
      return { existe: false, pagado: false };
    }
    return {
      existe: true,
      pagado: periodo.pagada,
      periodo: {
        idPeriodo: periodo.idPeriodo,
        nombrePeriodo: periodo.nombrePeriodo,
        fechaInicio: periodo.fechaInicio,
        fechaFin: periodo.fechaFin
      }
    };
  }
  /**
   * Obtener periodos por estado de pago
   */
  async obtenerPeriodosPorEstado(pagada = true) {
    return await this.tPeriodoRepository.findByPagada(pagada);
  }
};
PeriodoService = __decorateClass$B([
  injectable(),
  __decorateParam$m(0, inject(tPeriodoRepository))
], PeriodoService);

var __getOwnPropDesc$A = Object.getOwnPropertyDescriptor;
var __decorateClass$A = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$A(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$l = (index, decorator) => (target, key) => decorator(target, key, index);
let PeriodoController = class {
  constructor(periodoService) {
    this.periodoService = periodoService;
  }
  /**
   * Obtener los últimos periodos pagados
   */
  async obtenerUltimosPeriodosPagados(req, res) {
    await handleSend(res, async () => {
      const { limite } = req.query;
      const limiteNumerico = limite ? parseInt(limite) : 5;
      const periodos = await this.periodoService.obtenerUltimosPeriodosPagados(limiteNumerico);
      return periodos;
    }, "\xDAltimos periodos pagados obtenidos exitosamente.", true, "NOMINA");
  }
  /**
   * Obtener periodo por ID
   */
  async obtenerPeriodoPorId(req, res) {
    await handleSend(res, async () => {
      const { id_periodo } = req.params;
      const periodo = await this.periodoService.obtenerPeriodoPorId(parseInt(id_periodo));
      if (!periodo) {
        throw new Error("Periodo no encontrado");
      }
      return periodo;
    }, "Periodo obtenido exitosamente.", true, "NOMINA");
  }
  /**
   * Verificar si un periodo está pagado
   */
  async verificarPeriodoPagado(req, res) {
    await handleSend(res, async () => {
      const { id_periodo } = req.params;
      const resultado = await this.periodoService.verificarPeriodoPagado(parseInt(id_periodo));
      return resultado;
    }, "Verificaci\xF3n de periodo completada.", true, "NOMINA");
  }
  /**
   * Obtener periodos por estado
   */
  async obtenerPeriodosPorEstado(req, res) {
    await handleSend(res, async () => {
      const { pagada } = req.query;
      const estadoPagada = pagada === "true";
      const periodos = await this.periodoService.obtenerPeriodosPorEstado(estadoPagada);
      return periodos;
    }, "Periodos obtenidos exitosamente.", true, "NOMINA");
  }
};
PeriodoController = __decorateClass$A([
  injectable(),
  __decorateParam$l(0, inject(PeriodoService))
], PeriodoController);

const periodoRouter = Router();
const periodoController = container.resolve(PeriodoController);
periodoRouter.use(authMiddleware);
periodoRouter.get(
  "/ultimos-pagados",
  periodoController.obtenerUltimosPeriodosPagados.bind(periodoController)
);
periodoRouter.get(
  "/:id_periodo",
  periodoController.obtenerPeriodoPorId.bind(periodoController)
);
periodoRouter.get(
  "/:id_periodo/verificar-pagado",
  periodoController.verificarPeriodoPagado.bind(periodoController)
);
periodoRouter.get(
  "/estado",
  periodoController.obtenerPeriodosPorEstado.bind(periodoController)
);

class FirmaBoletaPagoModel extends Model {
}
FirmaBoletaPagoModel.init(
  {
    id_firma_boleta_pago: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    id_users: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    id_periodo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    phone_gps_longitude: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    phone_gps_latitude: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    hash_boleta_firmada: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    valido: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    motivo_invalidacion: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: "firma_boleta_pago",
    schema: "app",
    timestamps: true
  }
);

var __getOwnPropDesc$z = Object.getOwnPropertyDescriptor;
var __decorateClass$z = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$z(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let FirmaBoletaPagoRepository = class {
  async create(data, t = null) {
    const result = await FirmaBoletaPagoModel.create(data, { transaction: t });
    if (!result) throw new Error("Error al crear la firma de boleta de pago.");
    return result;
  }
  async findByUserAndPeriodo(id_users, id_periodo, valido = true, raw = false) {
    const result = await FirmaBoletaPagoModel.findOne({
      where: {
        id_users,
        id_periodo,
        valido
      },
      raw
    });
    return result;
  }
  async findByUserId(id_users, raw = false) {
    const result = await FirmaBoletaPagoModel.findAll({
      where: { id_users },
      order: [["createdAt", "DESC"]],
      raw
    });
    return result;
  }
  async findByPeriodo(id_periodo, raw = false) {
    const result = await FirmaBoletaPagoModel.findAll({
      where: {
        id_periodo,
        valido: true
      },
      order: [["createdAt", "DESC"]],
      raw
    });
    return result;
  }
  async findById(id_firma_boleta_pago, raw = false) {
    const result = await FirmaBoletaPagoModel.findByPk(id_firma_boleta_pago, { raw });
    return result;
  }
  async invalidarFirma(id_firma_boleta_pago, motivo, t = null) {
    const [affectedRows] = await FirmaBoletaPagoModel.update(
      {
        valido: false,
        motivo_invalidacion: motivo
      },
      {
        where: { id_firma_boleta_pago },
        transaction: t
      }
    );
    return affectedRows > 0;
  }
  async getAll(raw = false) {
    const result = await FirmaBoletaPagoModel.findAll({
      order: [["createdAt", "DESC"]],
      raw
    });
    return result;
  }
};
FirmaBoletaPagoRepository = __decorateClass$z([
  injectable()
], FirmaBoletaPagoRepository);

class tPlanillaModel extends Model {
}
tPlanillaModel.init(
  {
    idPlanilla: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idPeriodo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    codEmpleado: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    departamento: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    empleado: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    salarioMensual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    ordinario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    diasLaborados: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hSimples: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hDobles: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sSimples: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    sDobles: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    bonifDecreto: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    otrosIngresos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    neto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    igss: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    isr: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    seguro: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    ahorro: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    otrosDescuentos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    liquido: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    comentarios: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    anticipos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    }
  },
  {
    sequelize: sequelizeInit("NOMINA"),
    tableName: "tPlanilla",
    schema: "dbo",
    timestamps: false
    // SQL Server no tiene createdAt/updatedAt automáticos
  }
);

var __getOwnPropDesc$y = Object.getOwnPropertyDescriptor;
var __decorateClass$y = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$y(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let tPlanillaRepository = class {
  async findById(idPlanilla, raw = false) {
    const result = await tPlanillaModel.findByPk(idPlanilla, { raw });
    return result;
  }
  async findByEmpleadoAndPeriodo(codEmpleado, idPeriodo, raw = false) {
    const result = await tPlanillaModel.findOne({
      where: {
        codEmpleado,
        idPeriodo
      },
      raw
    });
    return result;
  }
  async findByEmpleado(codEmpleado, raw = false) {
    const result = await tPlanillaModel.findAll({
      where: { codEmpleado },
      order: [["idPeriodo", "DESC"]],
      raw
    });
    return result;
  }
  async findByPeriodo(idPeriodo, raw = false) {
    const result = await tPlanillaModel.findAll({
      where: { idPeriodo },
      order: [["empleado", "ASC"]],
      raw
    });
    return result;
  }
  async findByEmpresa(idEmpresa, raw = false) {
    const result = await tPlanillaModel.findAll({
      where: { idEmpresa },
      order: [["idPeriodo", "DESC"], ["empleado", "ASC"]],
      raw
    });
    return result;
  }
  async findByDepartamento(departamento, raw = false) {
    const result = await tPlanillaModel.findAll({
      where: { departamento },
      order: [["idPeriodo", "DESC"], ["empleado", "ASC"]],
      raw
    });
    return result;
  }
  async findByEmpresaAndPeriodo(idEmpresa, idPeriodo, raw = false) {
    const result = await tPlanillaModel.findAll({
      where: {
        idEmpresa,
        idPeriodo
      },
      order: [["empleado", "ASC"]],
      raw
    });
    return result;
  }
  async calculateTotalLiquidoByPeriodo(idPeriodo) {
    const sequelize = sequelizeInit("NOMINA");
    const result = await sequelize.query(
      `SELECT ISNULL(SUM(liquido), 0) as total FROM dbo.tPlanilla WHERE idPeriodo = :idPeriodo`,
      {
        replacements: { idPeriodo },
        type: QueryTypes.SELECT,
        plain: true
      }
    );
    return parseFloat(result?.total || 0);
  }
  async getEmpleadosSinPlanilla(idPeriodo) {
    const sequelize = sequelizeInit("NOMINA");
    const result = await sequelize.query(
      `SELECT e.codEmpleado, e.nombreEmpleado, e.apellidoEmpleado 
             FROM dbo.tEmpleado e 
             LEFT JOIN dbo.tPlanilla p ON e.codEmpleado = p.codEmpleado AND p.idPeriodo = :idPeriodo
             WHERE p.codEmpleado IS NULL AND e.activo = 1`,
      {
        replacements: { idPeriodo },
        type: QueryTypes.SELECT
      }
    );
    return result;
  }
  async getAll(raw = false) {
    const result = await tPlanillaModel.findAll({
      order: [["idPeriodo", "DESC"], ["empleado", "ASC"]],
      raw
    });
    return result;
  }
  /**
   * Obtener información completa de la boleta con datos del periodo
   */
  async findBoletaCompletaByEmpleadoAndPeriodo(codEmpleado, idPeriodo) {
    const sequelize = sequelizeInit("NOMINA");
    const result = await sequelize.query(
      `SELECT 
                p.idPlanilla,
                p.codEmpleado,
                p.empleado,
                p.codigo,
                p.departamento,
                p.idPeriodo,
                p.diasLaborados,
                p.ordinario,
                p.sSimples,
                p.sDobles,
                p.bonifDecreto,
                p.otrosIngresos,
                p.igss,
                p.isr,
                p.ahorro,
                p.seguro,
                p.otrosDescuentos,
                p.liquido,
                p.neto,
                per.nombrePeriodo AS nombrePeriodo,
                CONCAT(FORMAT(per.fechaInicio, 'dd/MM/yyyy'), ' al ', FORMAT(per.fechaFin, 'dd/MM/yyyy')) AS rangoPeriodo,
                FORMAT(per.fechaInicio, 'yyyy/MM/dd') AS fechaInicioPeriodo,
                FORMAT(per.fechaFin, 'yyyy/MM/dd') AS fechaFinPeriodo,
                per.pagada
            FROM dbo.tPlanilla p
            INNER JOIN dbo.tPeriodo per ON p.idPeriodo = per.idPeriodo
            WHERE p.codEmpleado = :codEmpleado AND p.idPeriodo = :idPeriodo`,
      {
        replacements: { codEmpleado, idPeriodo },
        type: QueryTypes.SELECT,
        plain: true
      }
    );
    return result;
  }
};
tPlanillaRepository = __decorateClass$y([
  injectable()
], tPlanillaRepository);

class tFirmaBoletaModel extends Model {
}
tFirmaBoletaModel.init(
  {
    idFirmaBoleta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    FechaHora: {
      type: DataTypes.DATE,
      allowNull: true,
      // Permitir null para que SQL Server maneje el DEFAULT
      // Sin defaultValue - SQL Server usará su constraint DEFAULT
      field: "FechaHora"
    },
    codEmpleado: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    firma: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    idDispositivo: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    datosBoleta: {
      type: DataTypes.STRING(1500),
      allowNull: false
    },
    idPeriodo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vigente: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  },
  {
    sequelize: sequelizeInit("PDV"),
    tableName: "tFirmaBoleta",
    schema: "dbo",
    timestamps: false
    // SQL Server no tiene createdAt/updatedAt automáticos
  }
);

var __getOwnPropDesc$x = Object.getOwnPropertyDescriptor;
var __decorateClass$x = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$x(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let tFirmaBoletaRepository = class {
  async create(data, t = null) {
    const { FechaHora, ...dataWithoutFechaHora } = data;
    const result = await tFirmaBoletaModel.create(dataWithoutFechaHora, { transaction: t });
    if (!result) throw new Error("Error al crear la firma de boleta PDV.");
    return result;
  }
  async findByEmpleadoAndPeriodo(codEmpleado, idPeriodo, vigente = true, raw = false) {
    const result = await tFirmaBoletaModel.findOne({
      where: {
        codEmpleado,
        idPeriodo,
        vigente
      },
      raw
    });
    return result;
  }
  async findByTiendaAndPeriodo(empresa, tienda, idPeriodo, raw = false) {
    const result = await tFirmaBoletaModel.findAll({
      where: {
        empresa,
        tienda,
        idPeriodo,
        vigente: true
      },
      order: [["FechaHora", "DESC"]],
      raw
    });
    return result;
  }
  async findByEmpleado(codEmpleado, raw = false) {
    const result = await tFirmaBoletaModel.findAll({
      where: { codEmpleado },
      order: [["FechaHora", "DESC"]],
      raw
    });
    return result;
  }
  async findById(idFirmaBoleta, raw = false) {
    const result = await tFirmaBoletaModel.findByPk(idFirmaBoleta, { raw });
    return result;
  }
  async invalidarFirma(idFirmaBoleta, t = null) {
    const [affectedRows] = await tFirmaBoletaModel.update(
      { vigente: false },
      {
        where: { idFirmaBoleta },
        transaction: t
      }
    );
    return affectedRows > 0;
  }
  async findByDispositivo(idDispositivo, raw = false) {
    const result = await tFirmaBoletaModel.findAll({
      where: { idDispositivo },
      order: [["FechaHora", "DESC"]],
      raw
    });
    return result;
  }
  async getAll(raw = false) {
    const result = await tFirmaBoletaModel.findAll({
      order: [["FechaHora", "DESC"]],
      raw
    });
    return result;
  }
};
tFirmaBoletaRepository = __decorateClass$x([
  injectable()
], tFirmaBoletaRepository);

var __getOwnPropDesc$w = Object.getOwnPropertyDescriptor;
var __decorateClass$w = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$w(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$k = (index, decorator) => (target, key) => decorator(target, key, index);
let FirmaBoletaService = class {
  constructor(firmaBoletaPagoRepository, tPlanillaRepository2, tPeriodoRepository2, tFirmaBoletaRepository2) {
    this.firmaBoletaPagoRepository = firmaBoletaPagoRepository;
    this.tPlanillaRepository = tPlanillaRepository2;
    this.tPeriodoRepository = tPeriodoRepository2;
    this.tFirmaBoletaRepository = tFirmaBoletaRepository2;
  }
  /**
   * Firma una boleta de pago por parte del empleado
   */
  async firmarBoleta(t, data, user) {
    const periodo = await this.tPeriodoRepository.findById(data.id_periodo, true);
    if (!periodo) {
      throw new Error("El per\xEDodo especificado no existe.");
    }
    if (!periodo.activo) {
      throw new Error("El per\xEDodo no est\xE1 activo para firmar boletas.");
    }
    if (!periodo.pagada) {
      throw new Error("Solo se pueden firmar boletas de per\xEDodos que ya han sido pagados.");
    }
    const planilla = await this.tPlanillaRepository.findByEmpleadoAndPeriodo(
      Number(user.id_users),
      data.id_periodo,
      true
    );
    if (!planilla) {
      throw new Error("No se encontr\xF3 planilla para este empleado en el per\xEDodo especificado.");
    }
    const firmaExistente = await this.firmaBoletaPagoRepository.findByUserAndPeriodo(
      Number(user.id_users),
      data.id_periodo,
      true
    );
    if (firmaExistente) {
      throw new Error("Ya existe una firma v\xE1lida para este empleado en este per\xEDodo.");
    }
    const firmaPdvExistente = await this.tFirmaBoletaRepository.findByEmpleadoAndPeriodo(
      Number(user.id_users),
      data.id_periodo,
      true
    );
    const hashBoleta = this.generarHashBoleta(planilla);
    const firmaUuid = v4();
    const firmaData = {
      id_users: user.id_users,
      id_periodo: data.id_periodo,
      phone_gps_longitude: data.phone_gps_longitude,
      phone_gps_latitude: data.phone_gps_latitude,
      hash_boleta_firmada: hashBoleta,
      userCreatedAt: user.id_users
    };
    const firma = await this.firmaBoletaPagoRepository.create(firmaData, t);
    if (!firma) {
      throw new Error("Error al registrar la firma de la boleta.");
    }
    let firmaPdv = null;
    if (!firmaPdvExistente) {
      try {
        const datosBoleta = this.generarDatosBoleta(planilla, periodo);
        const datosBol\u00E9taBase64 = Buffer.from(JSON.stringify(datosBoleta)).toString("base64");
        const firmaPdvData = {
          empresa: "0000",
          tienda: "0000",
          // NO incluir FechaHora - se genera automáticamente por SQL Server 
          codEmpleado: Number(user.id_users),
          firma: firmaUuid,
          idDispositivo: data.ip_dispositivo,
          datosBoleta: datosBol\u00E9taBase64,
          idPeriodo: data.id_periodo,
          vigente: true
        };
        firmaPdv = await this.tFirmaBoletaRepository.create(firmaPdvData, null);
        if (!firmaPdv) {
          console.warn("No se pudo crear el registro en PDV, pero el proceso contin\xFAa.");
        }
      } catch (pdvError) {
        console.error("Error al guardar en sistema PDV:", pdvError);
        firmaPdv = null;
      }
    }
    return {
      id_firma_boleta_pago: firma.id_firma_boleta_pago,
      id_firma_boleta_pdv: firmaPdv ? firmaPdv.idFirmaBoleta : firmaPdvExistente?.idFirmaBoleta || null,
      empleado: planilla.empleado,
      periodo: periodo.nombrePeriodo || `Per\xEDodo ${periodo.idPeriodo}`,
      monto_liquido: parseFloat(planilla.liquido?.toString() || "0"),
      fecha_firma: firma.createdAt,
      hash_boleta_firmada: hashBoleta,
      firma_uuid: firmaPdv ? firmaUuid : firmaPdvExistente?.firma || null
    };
  }
  /**
   * Obtiene el historial de firmas de un empleado
   */
  async obtenerHistorialFirmas(user) {
    const firmas = await this.firmaBoletaPagoRepository.findByUserId(Number(user.id_users), true);
    const historialPromises = firmas.map(async (firma) => {
      const periodo = await this.tPeriodoRepository.findById(firma.id_periodo, true);
      const planilla = await this.tPlanillaRepository.findByEmpleadoAndPeriodo(
        Number(user.id_users),
        firma.id_periodo,
        true
      );
      return {
        id_firma: firma.id_firma_boleta_pago,
        periodo: periodo?.nombrePeriodo || `Per\xEDodo ${firma.id_periodo}`,
        fecha_inicio: periodo?.fechaInicio,
        fecha_fin: periodo?.fechaFin,
        monto_liquido: parseFloat(planilla?.liquido?.toString() || "0"),
        fecha_firma: firma.createdAt,
        valido: firma.valido,
        motivo_invalidacion: firma.motivo_invalidacion
      };
    });
    return Promise.all(historialPromises);
  }
  /**
   * Verifica la integridad de una firma comparando el hash
   */
  async verificarIntegridad(id_firma_boleta_pago) {
    const firma = await this.firmaBoletaPagoRepository.findById(id_firma_boleta_pago);
    if (!firma) {
      throw new Error("Firma no encontrada.");
    }
    const planilla = await this.tPlanillaRepository.findByEmpleadoAndPeriodo(
      Number(firma.id_users),
      firma.id_periodo,
      true
    );
    if (!planilla) {
      throw new Error("No se encontr\xF3 la planilla asociada a esta firma.");
    }
    const hashActual = this.generarHashBoleta(planilla);
    return hashActual === firma.hash_boleta_firmada;
  }
  /**
   * Invalida una firma existente
   */
  async invalidarFirma(id_firma_boleta_pago, motivo, t) {
    return await this.firmaBoletaPagoRepository.invalidarFirma(
      id_firma_boleta_pago,
      motivo,
      t
    );
  }
  /**
   * Genera los datos completos de la boleta para almacenar en base64
   */
  generarDatosBoleta(planilla, periodo) {
    return {
      idPlanilla: planilla.idPlanilla,
      codigoEmpleado: planilla.codigo,
      nombreEmpleado: planilla.empleado,
      departamento: planilla.departamento,
      periodo: periodo.nombrePeriodo,
      fechaInicio: periodo.fechaInicio,
      fechaFin: periodo.fechaFin,
      diasLaborados: planilla.diasLaborados,
      hSimples: planilla.hSimples,
      hDobles: planilla.hDobles,
      ordinario: planilla.ordinario || 0,
      extraordinarioSimple: planilla.sSimples || 0,
      extraordinarioDoble: planilla.sDobles || 0,
      otrosIngresos: planilla.otrosIngresos || 0,
      bonifDecreto: planilla.bonifDecreto || 0,
      totalIngresos: (planilla.ordinario || 0) + (planilla.sSimples || 0) + (planilla.sDobles || 0) + (planilla.otrosIngresos || 0) + (planilla.bonifDecreto || 0),
      igss: planilla.igss || 0,
      isr: planilla.isr || 0,
      seguro: planilla.seguro || 0,
      otrosDescuentos: planilla.otrosDescuentos || 0,
      ahorro: planilla.ahorro || 0,
      anticipos: planilla.anticipos || 0,
      totalDeducciones: (planilla.igss || 0) + (planilla.isr || 0) + (planilla.seguro || 0) + (planilla.otrosDescuentos || 0) + (planilla.ahorro || 0),
      liquido: planilla.liquido || 0,
      comentarios: planilla.comentarios || "",
      fechaHora: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * Genera un hash único basado en los datos críticos de la planilla
   */
  generarHashBoleta(planilla) {
    const datosParaHash = {
      idPlanilla: planilla.idPlanilla,
      codEmpleado: planilla.codEmpleado,
      idPeriodo: planilla.idPeriodo,
      idEmpresa: planilla.idEmpresa,
      idDepartamento: planilla.departamento,
      diasLaborados: planilla.diasLaborados,
      salarioOrdinario: planilla.ordinario,
      horasSimples: planilla.sSimples || 0,
      horasDobles: planilla.sDobles || 0,
      bonificacion: planilla.bonifDecreto || 0,
      otrosIngresos: planilla.otrosIngresos || 0,
      neto: planilla.neto || 0,
      igss: planilla.igss || 0,
      isr: planilla.isr || 0,
      seguro: planilla.seguro || 0,
      ahorro: planilla.ahorro || 0,
      otrosDescuentos: planilla.otrosDescuentos || 0,
      liquido: planilla.liquido || 0
    };
    const dataString = JSON.stringify(datosParaHash, Object.keys(datosParaHash).sort());
    return crypto.createHash("sha256").update(dataString).digest("hex");
  }
  /**
   * Verifica si existe una firma válida para un empleado en un periodo específico
   */
  async verificarFirmaExistente(id_users, id_periodo) {
    const firmaExistente = await this.firmaBoletaPagoRepository.findByUserAndPeriodo(
      id_users,
      id_periodo,
      true
    );
    if (!firmaExistente) {
      return { existe: false };
    }
    const firmaData = {
      id_firma_boleta_pago: firmaExistente.id_firma_boleta_pago,
      fecha_firma: firmaExistente.createdAt,
      valido: firmaExistente.valido
    };
    if (firmaExistente.motivo_invalidacion) {
      firmaData.motivo_invalidacion = firmaExistente.motivo_invalidacion;
    }
    return {
      existe: true,
      firma: firmaData
    };
  }
};
FirmaBoletaService = __decorateClass$w([
  injectable(),
  __decorateParam$k(0, inject(FirmaBoletaPagoRepository)),
  __decorateParam$k(1, inject(tPlanillaRepository)),
  __decorateParam$k(2, inject(tPeriodoRepository)),
  __decorateParam$k(3, inject(tFirmaBoletaRepository))
], FirmaBoletaService);

var __getOwnPropDesc$v = Object.getOwnPropertyDescriptor;
var __decorateClass$v = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$v(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$j = (index, decorator) => (target, key) => decorator(target, key, index);
let FirmaBoletaController = class {
  constructor(firmaBoletaService) {
    this.firmaBoletaService = firmaBoletaService;
  }
  /**
   * Endpoint para firmar una boleta de pago
   */
  async firmarBoleta(req, res) {
    await handleSend(res, async (t) => {
      const result = await this.firmaBoletaService.firmarBoleta(
        t,
        req.body,
        req.user
      );
      return result;
    }, "Boleta firmada exitosamente.", true, "PIOAPP");
  }
  /**
   * Endpoint para obtener el historial de firmas del empleado
   */
  async obtenerHistorialFirmas(req, res) {
    await handleSend(res, async () => {
      const result = await this.firmaBoletaService.obtenerHistorialFirmas(
        req.user
      );
      return result;
    }, "Historial de firmas obtenido correctamente.");
  }
  /**
   * Endpoint para verificar la integridad de una firma
   */
  async verificarIntegridad(req, res) {
    await handleSend(res, async () => {
      const esValida = await this.firmaBoletaService.verificarIntegridad(
        req.body.id_firma_boleta_pago
      );
      return {
        id_firma_boleta_pago: req.body.id_firma_boleta_pago,
        integridad_valida: esValida,
        mensaje: esValida ? "La firma mantiene su integridad." : "La firma ha sido comprometida o los datos han cambiado."
      };
    }, "Verificaci\xF3n de integridad completada.");
  }
  /**
   * Endpoint para invalidar una firma (solo admin)
   */
  async invalidarFirma(req, res) {
    await handleSend(res, async (t) => {
      const { id_firma_boleta_pago, motivo } = req.body;
      const result = await this.firmaBoletaService.invalidarFirma(
        id_firma_boleta_pago,
        motivo,
        t
      );
      return {
        id_firma_boleta_pago,
        invalidada: result,
        motivo
      };
    }, "Firma invalidada exitosamente.", true, "PIOAPP");
  }
  /**
   * Verificar si existe una firma para un empleado en un periodo específico
   */
  async verificarFirmaExistente(req, res) {
    await handleSend(res, async () => {
      const { id_periodo } = req.body;
      if (!req.user) {
        throw new Error("Usuario no autenticado");
      }
      const result = await this.firmaBoletaService.verificarFirmaExistente(
        Number(req.user.id_users),
        id_periodo
      );
      return result;
    }, "Verificaci\xF3n de firma completada.", true, "PIOAPP");
  }
};
FirmaBoletaController = __decorateClass$v([
  injectable(),
  __decorateParam$j(0, inject(FirmaBoletaService))
], FirmaBoletaController);

const FirmaBoletaDto = yup.object({
  id_periodo: yup.number().integer().positive("El [id_periodo] debe ser un n\xFAmero positivo.").required("El [id_periodo] es un campo obligatorio."),
  phone_gps_longitude: yup.string().required("La [phone_gps_longitude] es un campo obligatorio."),
  phone_gps_latitude: yup.string().required("La [phone_gps_latitude] es un campo obligatorio."),
  ip_dispositivo: yup.string().matches(/^(\d{1,3}\.){3}\d{1,3}$/, "La [ip_dispositivo] debe ser una direcci\xF3n IP v\xE1lida.").required("La [ip_dispositivo] es un campo obligatorio.")
});
const InvalidarFirmaDto = yup.object({
  id_firma_boleta_pago: yup.string().uuid("El [id_firma_boleta_pago] debe ser un UUID v\xE1lido.").required("El [id_firma_boleta_pago] es un campo obligatorio."),
  motivo: yup.string().min(10, "El [motivo] debe tener al menos 10 caracteres.").max(500, "El [motivo] no puede exceder 500 caracteres.").required("El [motivo] es un campo obligatorio.")
});
const VerificarIntegridadDto = yup.object({
  id_firma_boleta_pago: yup.string().uuid("El [id_firma_boleta_pago] debe ser un UUID v\xE1lido.").required("El [id_firma_boleta_pago] es un campo obligatorio.")
});

const VerificarFirmaExistenteDto = yup.object({
  id_periodo: yup.number().required("El id del periodo es obligatorio").integer("El id del periodo debe ser un n\xFAmero entero").positive("El id del periodo debe ser positivo")
});

const firmaBoletaRouter = Router();
const firmaBoletaController = container.resolve(FirmaBoletaController);
firmaBoletaRouter.use(authMiddleware);
firmaBoletaRouter.post(
  "/firmar",
  validateFields(FirmaBoletaDto),
  firmaBoletaController.firmarBoleta.bind(firmaBoletaController)
);
firmaBoletaRouter.get(
  "/historial",
  firmaBoletaController.obtenerHistorialFirmas.bind(firmaBoletaController)
);
firmaBoletaRouter.get(
  "/existe",
  validateFields(VerificarFirmaExistenteDto, null, true),
  firmaBoletaController.verificarFirmaExistente.bind(firmaBoletaController)
);
firmaBoletaRouter.post(
  "/verificar",
  validateFields(VerificarIntegridadDto),
  firmaBoletaController.verificarIntegridad.bind(firmaBoletaController)
);
firmaBoletaRouter.post(
  "/invalidar",
  validateFields(InvalidarFirmaDto),
  firmaBoletaController.invalidarFirma.bind(firmaBoletaController)
);

var __getOwnPropDesc$u = Object.getOwnPropertyDescriptor;
var __decorateClass$u = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$u(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$i = (index, decorator) => (target, key) => decorator(target, key, index);
let BoletaConsultaService = class {
  constructor(tPlanillaRepository2, firmaBoletaRepository) {
    this.tPlanillaRepository = tPlanillaRepository2;
    this.firmaBoletaRepository = firmaBoletaRepository;
  }
  /**
   * Obtener resumen de pago por empleado y periodo
   */
  async obtenerResumenPago(codEmpleado, idPeriodo) {
    const boleta = await this.tPlanillaRepository.findBoletaCompletaByEmpleadoAndPeriodo(
      codEmpleado,
      idPeriodo
    );
    if (!boleta) {
      throw new Error("No se encontr\xF3 informaci\xF3n de pago para este empleado en el periodo especificado");
    }
    const totalDescuentos = (boleta.igss || 0) + (boleta.isr || 0) + (boleta.ahorro || 0) + (boleta.seguro || 0) + (boleta.otrosDescuentos || 0);
    const fechaInicio = new Date(boleta.fechaInicio).toLocaleDateString("es-GT");
    const fechaFin = new Date(boleta.fechaFin).toLocaleDateString("es-GT");
    return {
      nombrePeriodo: boleta.nombrePeriodo,
      totalRecibido: boleta.liquido || 0,
      numeroBoleta: boleta.idPlanilla,
      periodo: `${fechaInicio} - ${fechaFin}`,
      diasTrabajados: boleta.diasLaborados || 0,
      descuentos: {
        igss: boleta.igss || 0,
        isr: boleta.isr || 0,
        ahorro: boleta.ahorro || 0,
        seguro: boleta.seguro || 0,
        otrosDescuentos: boleta.otrosDescuentos || 0,
        totalDescuentos
      }
    };
  }
  /**
   * Obtener detalle completo de pago por empleado y periodo
   */
  async obtenerDetalleCompleto(idUsers, codEmpleado, idPeriodo) {
    const boleta = await this.tPlanillaRepository.findBoletaCompletaByEmpleadoAndPeriodo(
      codEmpleado,
      idPeriodo
    );
    if (!boleta) {
      throw new Error("No se encontr\xF3 informaci\xF3n de pago para este empleado en el periodo especificado");
    }
    const firma = await this.firmaBoletaRepository.findByUserAndPeriodo(idUsers, idPeriodo);
    const totalIngresos = (boleta.ordinario || 0) + (boleta.sSimples || 0) + (boleta.sDobles || 0) + (boleta.bonifDecreto || 0) + (boleta.otrosIngresos || 0);
    const totalDescuentos = (boleta.igss || 0) + (boleta.isr || 0) + (boleta.ahorro || 0) + (boleta.seguro || 0) + (boleta.otrosDescuentos || 0);
    const response = {
      numeroBoleta: boleta.idPlanilla,
      empleado: {
        codigo: boleta.codigo?.trim() || null,
        nombre: boleta.empleado?.trim() || null
      },
      periodo: {
        id: boleta.idPeriodo,
        nombre: boleta.nombrePeriodo,
        rango: boleta.rangoPeriodo,
        fechaInicio: boleta.fechaInicioPeriodo,
        fechaFin: boleta.fechaFinPeriodo
      },
      diasTrabajados: boleta.diasLaborados || 0,
      ingresos: {
        salarioOrdinario: boleta.ordinario || 0,
        horasSimples: boleta.sSimples || 0,
        horasDobles: boleta.sDobles || 0,
        bonificacion: boleta.bonifDecreto || 0,
        otrosIngresos: boleta.otrosIngresos || 0,
        totalIngresos
      },
      descuentos: {
        igss: boleta.igss || 0,
        isr: boleta.isr || 0,
        ahorro: boleta.ahorro || 0,
        seguro: boleta.seguro || 0,
        otrosDescuentos: boleta.otrosDescuentos || 0,
        totalDescuentos
      },
      neto: boleta.neto || 0,
      liquido: boleta.liquido || 0
    };
    if (firma) {
      response.firma = {
        idFirmaBoleta: firma.id_firma_boleta_pago,
        fechaFirma: firma.createdAt,
        valido: firma.valido
      };
    }
    return response;
  }
  /**
   * Verificar si existe información de pago para un empleado en un periodo
   */
  async verificarExistenciaBoleta(codEmpleado, idPeriodo) {
    const boleta = await this.tPlanillaRepository.findBoletaCompletaByEmpleadoAndPeriodo(
      codEmpleado,
      idPeriodo
    );
    if (!boleta) {
      return { existe: false };
    }
    return {
      existe: true,
      pagado: boleta.pagada || false
    };
  }
};
BoletaConsultaService = __decorateClass$u([
  injectable(),
  __decorateParam$i(0, inject(tPlanillaRepository)),
  __decorateParam$i(1, inject(FirmaBoletaPagoRepository))
], BoletaConsultaService);

var __getOwnPropDesc$t = Object.getOwnPropertyDescriptor;
var __decorateClass$t = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$t(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$h = (index, decorator) => (target, key) => decorator(target, key, index);
let BoletaConsultaController = class {
  constructor(boletaConsultaService) {
    this.boletaConsultaService = boletaConsultaService;
  }
  /**
   * Obtener resumen de pago
   */
  async obtenerResumenPago(req, res) {
    await handleSend(res, async () => {
      const { id_periodo } = req.body;
      if (!req.user) {
        throw new Error("Usuario no autenticado");
      }
      const user = req.user;
      const resumen = await this.boletaConsultaService.obtenerResumenPago(
        Number(user.id_users),
        // cod_empleado del usuario autenticado
        id_periodo
      );
      return resumen;
    }, "Resumen de pago obtenido exitosamente.", true, "NOMINA");
  }
  /**
   * Obtener detalle completo de pago
   */
  async obtenerDetalleCompleto(req, res) {
    await handleSend(res, async () => {
      const { id_periodo } = req.body;
      if (!req.user) {
        throw new Error("Usuario no autenticado");
      }
      const user = req.user;
      const detalle = await this.boletaConsultaService.obtenerDetalleCompleto(
        Number(user.id_users),
        Number(user.id_users),
        // cod_empleado del usuario autenticado
        id_periodo
      );
      return detalle;
    }, "Detalle completo de pago obtenido exitosamente.", true, "NOMINA");
  }
  /**
   * Verificar existencia de boleta
   */
  async verificarExistenciaBoleta(req, res) {
    await handleSend(res, async () => {
      const { id_periodo } = req.body;
      if (!req.user) {
        throw new Error("Usuario no autenticado");
      }
      const user = req.user;
      const resultado = await this.boletaConsultaService.verificarExistenciaBoleta(
        Number(user.id_users),
        // cod_empleado del usuario autenticado
        id_periodo
      );
      return resultado;
    }, "Verificaci\xF3n completada.", true, "NOMINA");
  }
};
BoletaConsultaController = __decorateClass$t([
  injectable(),
  __decorateParam$h(0, inject(BoletaConsultaService))
], BoletaConsultaController);

const ConsultaBoletaDto = yup.object({
  id_periodo: yup.number().required("El id del periodo es obligatorio").integer("El id del periodo debe ser un n\xFAmero entero").positive("El id del periodo debe ser positivo")
});

const boletaConsultaRouter = Router();
const boletaConsultaController = container.resolve(BoletaConsultaController);
boletaConsultaRouter.use(authMiddleware);
boletaConsultaRouter.get(
  "/resumen",
  validateFields(ConsultaBoletaDto, null, true),
  boletaConsultaController.obtenerResumenPago.bind(boletaConsultaController)
);
boletaConsultaRouter.get(
  "/detalle-completo",
  validateFields(ConsultaBoletaDto, null, true),
  boletaConsultaController.obtenerDetalleCompleto.bind(boletaConsultaController)
);
boletaConsultaRouter.get(
  "/verificar-existencia",
  validateFields(ConsultaBoletaDto, null, true),
  boletaConsultaController.verificarExistenciaBoleta.bind(boletaConsultaController)
);

class tEntradaInventarioDetalleModel extends Model {
  idEntradaInventarioDetalle;
  idEntradaInventario;
  itemCode;
  uomCode;
  quantity;
  cantidadInventario;
}
tEntradaInventarioDetalleModel.init(
  {
    idEntradaInventarioDetalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    idEntradaInventario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    itemCode: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    uomCode: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    cantidadInventario: {
      type: DataTypes.DECIMAL(19, 6),
      allowNull: true
    }
  },
  {
    sequelize: sequelizeInit("PDV"),
    // tableName: 'tEntradaInventarioDetallePrueba',
    tableName: "tEntradaInventarioDetalle",
    timestamps: false
  }
);

var __getOwnPropDesc$s = Object.getOwnPropertyDescriptor;
var __decorateClass$s = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$s(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let EntradaInventarioDetalleRepository = class {
  async create(data, t = null, error = true) {
    const result = await tEntradaInventarioDetalleModel.create(data, { transaction: t });
    if (!result && error) throw new Error("Erro al crear el detalle de entrada de inventario.");
    return result;
  }
};
EntradaInventarioDetalleRepository = __decorateClass$s([
  injectable()
], EntradaInventarioDetalleRepository);

class tEntradaInventarioModel extends Model {
  idEntradaInventario;
  serie;
  numero;
  empresa;
  tienda;
  fecha;
  anulado;
  docEntry;
  docNum;
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
    sequelize: sequelizeInit("PDV"),
    // tableName: 'tEntradaInventarioPrueba',
    tableName: "tEntradaInventario",
    timestamps: false
  }
);

var __getOwnPropDesc$r = Object.getOwnPropertyDescriptor;
var __decorateClass$r = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$r(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let EntradaInventarioRepository = class {
  async create(data, t = null, error = true, raw = false) {
    const result = await tEntradaInventarioModel.create(data, { transaction: t });
    if (!result && error) throw new Error("Error al crear la entrada inventario.");
    return raw ? result.get({ plain: true }) : result;
  }
  async findEntradaInventario(filters, error = true, raw = false) {
    const result = await tEntradaInventarioModel.findOne({
      where: { ...filters },
      raw
    });
    if (!result && error) throw new Error("Error no se econtro ninguna entrada inventario.");
    return result;
  }
  async updateByIdEntradaInventario(idEntradaInventario, data, error = true, t = null) {
    const [filasActualizadas] = await tEntradaInventarioModel.update(data, {
      where: {
        idEntradaInventario
      },
      transaction: t
    });
    if (filasActualizadas <= 0 && error) throw new Error(`Error al editar la entrada con idEntradaInventario -> ${idEntradaInventario}`);
    return filasActualizadas;
  }
};
EntradaInventarioRepository = __decorateClass$r([
  injectable()
], EntradaInventarioRepository);

const SERIES_AVICOLA = ["AG2", "AG3", "AGPE"];
const SERIES_INSUMOS = ["INS", "PEI"];
const validResponseSapRecepcion = (responseSapSdk) => {
  const { llave, llave2, resultado } = responseSapSdk;
  if (!llave || !llave2 || !resultado) throw new Error("Ocurrio un error al realizar la entrada de inventario a SAP porfavor intente de nuevo.");
};

async function handleTransaction(callback = async () => {
}, connection = DEFAULT_CONNECTION) {
  let t = await sequelizeInit(connection).transaction();
  try {
    const result = await callback(t);
    await t.commit();
    return result;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

const clearTextAndUpperCase = (text) => {
  return text.trim().toUpperCase();
};

var __getOwnPropDesc$q = Object.getOwnPropertyDescriptor;
var __decorateClass$q = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$q(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$g = (index, decorator) => (target, key) => decorator(target, key, index);
let EntradaPdvService = class {
  constructor(entradaInventarioDetalleRepository, entradaInventarioRepository) {
    this.entradaInventarioDetalleRepository = entradaInventarioDetalleRepository;
    this.entradaInventarioRepository = entradaInventarioRepository;
  }
  validSerieEntrada(data) {
    const serie = clearTextAndUpperCase(data.cabecera.serie);
    const objValidSeries = [
      ...SERIES_AVICOLA,
      ...SERIES_INSUMOS
    ];
    const valid = objValidSeries.includes(serie);
    if (!valid) throw new Error(`Error Serie -> [${serie}] invalida.`);
  }
  async createEntradas(data) {
    const result = await handleTransaction(async (t) => {
      const { cabecera, detalle } = data;
      const dataCreateEntradaInventario = {
        serie: cabecera.serie,
        numero: cabecera.id_pedido,
        empresa: cabecera.empresa,
        tienda: cabecera.tienda,
        anulado: false
      };
      let createEncabezadoEntradaInventario = null;
      createEncabezadoEntradaInventario = await this.entradaInventarioRepository.findEntradaInventario(dataCreateEntradaInventario, false, true);
      if (createEncabezadoEntradaInventario) return createEncabezadoEntradaInventario;
      createEncabezadoEntradaInventario = await this.entradaInventarioRepository.create({
        ...dataCreateEntradaInventario,
        fecha: Sequelize.literal("GETDATE()")
      }, t, true, true);
      const idEntradaInventario = createEncabezadoEntradaInventario?.idEntradaInventario || null;
      if (!idEntradaInventario) throw new Error("Error al obtener el [idEntradaInventario]");
      await Promise.all(
        detalle.map((el) => this.entradaInventarioDetalleRepository.create({
          idEntradaInventario,
          itemCode: el.codigo_articulo,
          uomCode: el.description,
          quantity: el.cantidad,
          cantidadInventario: 1
        }, t))
      );
      return createEncabezadoEntradaInventario;
    }, "PDV");
    return result;
  }
  async updateEncabezadoByIdEntradaInventario(entrada, responseSap) {
    const result = await handleTransaction(async (t) => {
      const updateCount = await this.entradaInventarioRepository.updateByIdEntradaInventario(
        entrada.idEntradaInventario,
        {
          docEntry: responseSap.llave,
          docNum: responseSap.llave2
        },
        true,
        t
      );
      return updateCount;
    }, "PDV");
    return result;
  }
};
EntradaPdvService = __decorateClass$q([
  injectable(),
  __decorateParam$g(0, inject(EntradaInventarioDetalleRepository)),
  __decorateParam$g(1, inject(EntradaInventarioRepository))
], EntradaPdvService);

class InsumosEncabezadoRecepcionadosView extends Model {
  // public id?: number;
  idSolicitud;
  tienda;
  fecha;
  fechaRequerido;
  almacenCentral;
  almacenDestino;
  comentario;
  cardCode;
  serie;
  numero;
  idEntrada;
}
InsumosEncabezadoRecepcionadosView.init(
  {
    // id: {
    //     type: DataTypes.BIGINT,
    //     allowNull: true,
    //     primaryKey: true,
    //     // autoIncrement: true
    // },
    idSolicitud: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tienda: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    fecha: {
      type: DataTypes.STRING(4e3),
      allowNull: true
    },
    fechaRequerido: {
      type: DataTypes.STRING(4e3),
      allowNull: true
    },
    almacenCentral: {
      type: DataTypes.STRING(52),
      allowNull: true
    },
    almacenDestino: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cardCode: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    serie: {
      type: DataTypes.STRING(4),
      allowNull: false,
      primaryKey: true
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idEntrada: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize: sequelizeInit("GRUPOPINULITO"),
    tableName: "vwInsumosEncabezadoRecepccionados",
    timestamps: false
  }
);

var __getOwnPropDesc$p = Object.getOwnPropertyDescriptor;
var __decorateClass$p = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$p(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let EncabezadoInsumosRecepcionadosRepository = class {
  async findEncabezadoBySerieAndIdEntradaInventario(serie, idEntrada, error = true, raw = false) {
    const result = await InsumosEncabezadoRecepcionadosView.findOne({ where: {
      serie,
      idEntrada
    }, raw });
    if (!result && error) throw new Error(`Error no se encontro ningun encabezado de recepcion con serie: ${serie} y idEntradaInventario: ${idEntrada}`);
    return result;
  }
};
EncabezadoInsumosRecepcionadosRepository = __decorateClass$p([
  injectable()
], EncabezadoInsumosRecepcionadosRepository);

class InsumosDetalleRecepcionView extends Model {
  // public id?: bigint;
  idEntradaInventario;
  ItemCode;
  ItemName;
  cantidad;
  precioTotal;
  porcentaje;
}
InsumosDetalleRecepcionView.init(
  {
    // id: {
    //     type: DataTypes.BIGINT,
    //     allowNull: true,
    //     primaryKey: true,
    //     autoIncrement: true
    // },
    idEntradaInventario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ItemCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    ItemName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    cantidad: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    precioTotal: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    porcentaje: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  },
  {
    sequelize: sequelizeInit("GRUPOPINULITO"),
    tableName: "vwInsumosDetalleRecepcion",
    timestamps: false
  }
);

class DetalleInsumosRecepcionRepository {
  async getProductosByIdEntradaInventario(idEntradaInventario, raw = false) {
    const result = await InsumosDetalleRecepcionView.findAll({
      where: {
        idEntradaInventario
      },
      raw
    });
    return result;
  }
}

class tSolicitudSupervisorTiendaModel extends Model {
  idSolicitud;
  codigoTienda;
  cardCode;
  codTienda;
  comments;
  fechaPedido;
  usuarioSolicita;
  usuarioRevisa;
  fechaSolicitud;
  ordeRuta;
  ruta;
  piloto;
  vehiculo;
  docNum;
  docEntry;
  vigente;
  situacion;
  estado;
  serie;
  docEntryRecp;
  docNumRecp;
  situacionRep;
  comentarioTienda;
  docEntryEntra;
  docNumEntra;
  suspendido;
  codEmpleadoPiloto;
}
tSolicitudSupervisorTiendaModel.init(
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
    fechaSolicitud: {
      type: DataTypes.DATE,
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
    vigente: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    situacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estado: {
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
    comentarioTienda: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    docEntryEntra: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    docNumEntra: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    suspendido: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    codEmpleadoPiloto: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize: sequelizeInit("PDV"),
    // tableName: 'tSolicitudSupervisorTiendaPrueba',
    tableName: "tSolicitudSupervisorTienda",
    timestamps: false
  }
);

var __getOwnPropDesc$o = Object.getOwnPropertyDescriptor;
var __decorateClass$o = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$o(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let SolicitudSupervisorTiendaRepository = class {
  async updateByIdSolicitud(idSolicitud, data, error = true, t = null) {
    const [filasActualizadas] = await tSolicitudSupervisorTiendaModel.update(data, {
      where: {
        idSolicitud
      },
      transaction: t
    });
    if (filasActualizadas <= 0 && error) throw new Error(`Error al editar la solicitud con idSolicitud -> ${idSolicitud}`);
    return filasActualizadas;
  }
};
SolicitudSupervisorTiendaRepository = __decorateClass$o([
  injectable()
], SolicitudSupervisorTiendaRepository);

class tSolicitudEspecialInsumosModel extends Model {
  idSolicitud;
  codigoTienda;
  cardCode;
  codTienda;
  comments;
  fechaPedido;
  usuarioSolicita;
  usuarioRevisa;
  ordeRuta;
  ruta;
  piloto;
  vehiculo;
  docNum;
  docEntry;
  serie;
  docEntryRecp;
  docNumRecp;
  situacionRep;
  fechaSolicitud;
  vigente;
  situacion;
  comentarioTienda;
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
      type: DataTypes.STRING(3e3),
      allowNull: true
    }
  },
  {
    sequelize: sequelizeInit("PDV"),
    // tableName: 'tSolicitudEspecialInsumosPrueba',
    tableName: "tSolicitudEspecialInsumos",
    timestamps: false
  }
);

var __getOwnPropDesc$n = Object.getOwnPropertyDescriptor;
var __decorateClass$n = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$n(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let SolicitudEspecialInsumosRepository = class {
  async updateByIdSolicitud(idSolicitud, data, error = true, t = null) {
    const [filasActualizadas] = await tSolicitudEspecialInsumosModel.update(data, {
      where: {
        idSolicitud
      },
      transaction: t
    });
    if (filasActualizadas <= 0 && error) throw new Error(`Error al editar la solicitud con idSolicitud -> ${idSolicitud}`);
    return filasActualizadas;
  }
};
SolicitudEspecialInsumosRepository = __decorateClass$n([
  injectable()
], SolicitudEspecialInsumosRepository);

var __getOwnPropDesc$m = Object.getOwnPropertyDescriptor;
var __decorateClass$m = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$m(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$f = (index, decorator) => (target, key) => decorator(target, key, index);
let SolicitudInsumosService = class {
  constructor(solicitudSupervisorTiendaRepository, solicitudEspecialInsumosRepository) {
    this.solicitudSupervisorTiendaRepository = solicitudSupervisorTiendaRepository;
    this.solicitudEspecialInsumosRepository = solicitudEspecialInsumosRepository;
  }
  async updateInsumoPdv(entrada, responseSapSdk) {
    const result = await handleTransaction(async (t) => {
      const dataUpdate = {
        docEntryRecp: responseSapSdk.llave,
        docNumRecp: responseSapSdk.llave2,
        situacionRep: 1,
        situacion: 3
      };
      const updateIsumosPdv = entrada.serie === "INS" ? this.solicitudSupervisorTiendaRepository.updateByIdSolicitud(entrada.numero, dataUpdate, true, t) : this.solicitudEspecialInsumosRepository.updateByIdSolicitud(entrada.numero, dataUpdate, true, t);
      return updateIsumosPdv;
    }, "PDV");
    return result;
  }
};
SolicitudInsumosService = __decorateClass$m([
  injectable(),
  __decorateParam$f(0, inject(SolicitudSupervisorTiendaRepository)),
  __decorateParam$f(1, inject(SolicitudEspecialInsumosRepository))
], SolicitudInsumosService);

const timeout = function(s) {
  return new Promise(function(_, reject) {
    setTimeout(() => {
      reject(new Error(`Lo sentimos la consulta tardo ${s} segundos!, intente de nuevo.`));
    }, s * 1e3);
  });
};
async function AJAX(url = "", method = "GET", api_token = "", uploadData = null, formData = false, blob = false, headers = null, timeoutFetch = 30) {
  try {
    const fetchResponse = fetch(`${url}`, {
      method,
      headers: {
        "Accept": "application/json",
        ...blob === false && !formData && {
          "Content-Type": "application/json; charset=utf-8"
        },
        ...api_token ? { "Authorization": `Bearer ${api_token}` } : {},
        ...headers
      },
      ...uploadData ? { body: formData ? uploadData : JSON.stringify(uploadData) } : {}
    });
    const response = await Promise.race([fetchResponse, timeout(timeoutFetch)]);
    const data = blob ? await response.blob() : await response.json();
    if (!response.ok) throw new Error(data?.message || "Internal Server error response.");
    return data;
  } catch (error) {
    throw error;
  }
}

var __getOwnPropDesc$l = Object.getOwnPropertyDescriptor;
var __decorateClass$l = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$l(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$e = (index, decorator) => (target, key) => decorator(target, key, index);
let SapInsumosService = class {
  constructor(encabezadoInsumosRecepcionadosRepository, detalleInsumosRecepcionRepository, solicitudInsumosService) {
    this.encabezadoInsumosRecepcionadosRepository = encabezadoInsumosRecepcionadosRepository;
    this.detalleInsumosRecepcionRepository = detalleInsumosRecepcionRepository;
    this.solicitudInsumosService = solicitudInsumosService;
  }
  URL_SKD_TRANSFER_INSUMOS = "http://110.238.64.185:5064/SolicitudSupervisorTiendaPos";
  URL_SKD_ENTRY_INSUMOS = "http://110.238.64.185:5064/EntradaMercaderiaPollo";
  async getInsumosForUploadSap(data) {
    const encabezadoInsumos = await this.encabezadoInsumosRecepcionadosRepository.findEncabezadoBySerieAndIdEntradaInventario(
      data?.serie ?? "",
      data?.idEntradaInventario ?? 0,
      true,
      true
    );
    const detalleInsumos = await this.detalleInsumosRecepcionRepository.getProductosByIdEntradaInventario(data?.idEntradaInventario ?? 0, true);
    return {
      ...encabezadoInsumos,
      empresa: "00001",
      productos: detalleInsumos
    };
  }
  async postUploadSapInsumos(data) {
    const companysEntry = ["00002", "00003", "00004", "00005", "00007"];
    let object = await this.getInsumosForUploadSap(data);
    const responseSKDTransfer = await AJAX(this.URL_SKD_TRANSFER_INSUMOS, "POST", null, object);
    validResponseSapRecepcion(responseSKDTransfer);
    await this.solicitudInsumosService.updateInsumoPdv(data, responseSKDTransfer);
    if (!companysEntry.includes(data.empresa)) return responseSKDTransfer;
    object = { ...object, empresa: data.empresa, cardCode: "PG00007" };
    const responseSKDEntry = await AJAX(this.URL_SKD_ENTRY_INSUMOS, "POST", null, object);
    validResponseSapRecepcion(responseSKDEntry);
    return responseSKDEntry;
  }
};
SapInsumosService = __decorateClass$l([
  injectable(),
  __decorateParam$e(0, inject(EncabezadoInsumosRecepcionadosRepository)),
  __decorateParam$e(1, inject(DetalleInsumosRecepcionRepository)),
  __decorateParam$e(2, inject(SolicitudInsumosService))
], SapInsumosService);

class PolloEncabezadoRecepcionView extends Model {
  // public id?: number;
  fecha;
  empresa;
  tda_nombre;
  serie;
  numero;
  idEntrada;
  tienda;
  cardCode;
}
PolloEncabezadoRecepcionView.init(
  {
    // id: {
    //     type: DataTypes.BIGINT,
    //     allowNull: true,
    //     primaryKey: true
    // },
    fecha: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    empresa: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    tda_nombre: {
      type: DataTypes.STRING(256),
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
    idEntrada: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tienda: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    cardCode: {
      type: DataTypes.STRING(7),
      allowNull: false
    }
  },
  {
    sequelize: sequelizeInit("GRUPOPINULITO"),
    tableName: "vwPolloEncabezadoRecepcion",
    timestamps: false
  }
);

var __getOwnPropDesc$k = Object.getOwnPropertyDescriptor;
var __decorateClass$k = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$k(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let PolloEncabezadoRecepcionRepository = class {
  async findEncabezadoByIdEntradaInventario(idEntradaInventario, error = true, raw = false) {
    const result = await PolloEncabezadoRecepcionView.findOne({
      where: {
        idEntrada: idEntradaInventario
      },
      raw
    });
    if (!result && error) throw new Error(`Error no se econtro ningun encabezado de pollo con idEntradaInventario -> ${idEntradaInventario}`);
    return result;
  }
};
PolloEncabezadoRecepcionRepository = __decorateClass$k([
  injectable()
], PolloEncabezadoRecepcionRepository);

class PolloDetalleRecepcionView extends Model {
  // public id?: number;
  SkuEqv;
  ItemCode;
  itemName;
  cantidad;
  precioTotal;
  idEntradaInventario;
}
PolloDetalleRecepcionView.init(
  {
    // id: {
    //     type: DataTypes.BIGINT,
    //     allowNull: true,
    //     primaryKey: true
    // },
    SkuEqv: {
      type: DataTypes.STRING(25),
      allowNull: true,
      primaryKey: true
    },
    ItemCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    itemName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    cantidad: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    precioTotal: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    idEntradaInventario: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize: sequelizeInit("GRUPOPINULITO"),
    tableName: "vwPolloDetalleRecepcion",
    timestamps: false
  }
);

var __getOwnPropDesc$j = Object.getOwnPropertyDescriptor;
var __decorateClass$j = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$j(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let PolloDetalleRecepcionadoRepository = class {
  async getAllDetalleByIdEntradaInventario(idEntradaInventario, raw = false) {
    const result = await PolloDetalleRecepcionView.findAll({
      where: {
        idEntradaInventario
      },
      raw
    });
    return result;
  }
};
PolloDetalleRecepcionadoRepository = __decorateClass$j([
  injectable()
], PolloDetalleRecepcionadoRepository);

var __getOwnPropDesc$i = Object.getOwnPropertyDescriptor;
var __decorateClass$i = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$i(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$d = (index, decorator) => (target, key) => decorator(target, key, index);
let SapPolloService = class {
  constructor(polloEncabezadoRecepcionRepository, polloDetalleRecepcionadoRepository) {
    this.polloEncabezadoRecepcionRepository = polloEncabezadoRecepcionRepository;
    this.polloDetalleRecepcionadoRepository = polloDetalleRecepcionadoRepository;
  }
  URL_SKD_ENTRY_AVICOLA = "http://110.238.64.185:5064/EntradaMercaderiaPollo";
  async getPolloForUploadSap(data) {
    const encabezadoPollo = await this.polloEncabezadoRecepcionRepository.findEncabezadoByIdEntradaInventario(
      data?.idEntradaInventario ?? 0,
      true,
      true
    );
    const detallePollo = await this.polloDetalleRecepcionadoRepository.getAllDetalleByIdEntradaInventario(
      data?.idEntradaInventario ?? 0,
      true
    );
    return {
      ...encabezadoPollo,
      productos: detallePollo
    };
  }
  async postUploadSapPollo(data) {
    const object = await this.getPolloForUploadSap(data);
    const responseSKDPollo = await AJAX(this.URL_SKD_ENTRY_AVICOLA, "POST", null, object);
    validResponseSapRecepcion(responseSKDPollo);
    return responseSKDPollo;
  }
};
SapPolloService = __decorateClass$i([
  injectable(),
  __decorateParam$d(0, inject(PolloEncabezadoRecepcionRepository)),
  __decorateParam$d(1, inject(PolloDetalleRecepcionadoRepository))
], SapPolloService);

var __getOwnPropDesc$h = Object.getOwnPropertyDescriptor;
var __decorateClass$h = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$h(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$c = (index, decorator) => (target, key) => decorator(target, key, index);
let RecepcionesServices = class {
  constructor(entradaPdvService, sapInsumosService, sapPolloService) {
    this.entradaPdvService = entradaPdvService;
    this.sapInsumosService = sapInsumosService;
    this.sapPolloService = sapPolloService;
  }
  async saveRecepcionService(data, user) {
    let responseSapSdk = null;
    this.entradaPdvService.validSerieEntrada(data);
    const entradaEncabezadoPdv = await this.entradaPdvService.createEntradas(data);
    const isInsumo = SERIES_INSUMOS.includes(clearTextAndUpperCase(entradaEncabezadoPdv?.serie ?? ""));
    const isPollo = SERIES_AVICOLA.includes(clearTextAndUpperCase(entradaEncabezadoPdv?.serie ?? ""));
    if (isInsumo) responseSapSdk = await this.sapInsumosService.postUploadSapInsumos(entradaEncabezadoPdv);
    if (isPollo) responseSapSdk = await this.sapPolloService.postUploadSapPollo(entradaEncabezadoPdv);
    await this.entradaPdvService.updateEncabezadoByIdEntradaInventario(
      entradaEncabezadoPdv,
      responseSapSdk
    );
    return responseSapSdk;
  }
};
RecepcionesServices = __decorateClass$h([
  injectable(),
  __decorateParam$c(0, inject(EntradaPdvService)),
  __decorateParam$c(1, inject(SapInsumosService)),
  __decorateParam$c(2, inject(SapPolloService))
], RecepcionesServices);

var __getOwnPropDesc$g = Object.getOwnPropertyDescriptor;
var __decorateClass$g = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$g(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$b = (index, decorator) => (target, key) => decorator(target, key, index);
let RecepcionesController = class {
  constructor(recepcionesServices) {
    this.recepcionesServices = recepcionesServices;
  }
  async uploadRecepccionesClient(req, res) {
    await handleSend(res, async () => {
      const result = await this.recepcionesServices.saveRecepcionService(
        req.body,
        req.user
      );
      return result;
    }, "Recepccion creada correctamente.");
  }
};
RecepcionesController = __decorateClass$g([
  injectable(),
  __decorateParam$b(0, inject(RecepcionesServices))
], RecepcionesController);

const saveRecepcionDto = yup.object({
  cabecera: yup.object().shape({
    id_pedido: yup.number().required("El [id_pedido] es un campo obligatorio."),
    serie: yup.string().required("La [serie] es un campo obligatorio."),
    empresa: yup.string().required("La [empresa] es un campo obligatorio y debe tener 5 caracteres."),
    tienda: yup.string().required("La [tienda] es un campo obligatorio y debe tener 5 caracteres.")
  }).required("El objeto [cabecera] es requerido."),
  detalle: yup.array().of(
    yup.object().shape({
      codigo_articulo: yup.string().required("El [codigo_articulo] es un campo obligatorio."),
      cantidad: yup.number().required("La [cantidad] es un campo obligatorio."),
      description: yup.string().required("El [description] es un campo obligatorio.")
    })
  ).required("El arreglo [detalle] debe tener al menos un elemento.")
});

const recepcionesRouter = Router();
const recepcionesController = container.resolve(RecepcionesController);
recepcionesRouter.use(authMiddleware);
recepcionesRouter.post(
  "/save",
  validateFields(saveRecepcionDto),
  recepcionesController.uploadRecepccionesClient.bind(recepcionesController)
);

const PaserJsonFileContent = (data) => {
  const parsedLines = data.split("\n").filter((line) => line.trim() !== "").map((line) => JSON.parse(line));
  return parsedLines;
};
function groupByField(data, field) {
  return data.reduce((acc, item) => {
    const key = item[field] || "Sin valor";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

var __getOwnPropDesc$f = Object.getOwnPropertyDescriptor;
var __decorateClass$f = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$f(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let FsService = class {
  constructor() {
  }
  async getNameFilesJson(dirname, typeFiles) {
    let files = await promises.readdir(dirname);
    if (typeFiles) files = files.filter((f) => f.endsWith(typeFiles));
    return files;
  }
  async getContentJson(dirname, nameFile) {
    const filePath = join(dirname, nameFile);
    const content = await promises.readFile(filePath, "utf-8");
    const resultJson = PaserJsonFileContent(content);
    return resultJson;
  }
};
FsService = __decorateClass$f([
  injectable()
], FsService);

var __getOwnPropDesc$e = Object.getOwnPropertyDescriptor;
var __decorateClass$e = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$e(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$a = (index, decorator) => (target, key) => decorator(target, key, index);
let LogsService = class {
  constructor(fsService) {
    this.fsService = fsService;
  }
  LOG_DIR = path.join(process.cwd(), "src", "storage", "logs");
  async getFileLogsJson() {
    const resultFiles = await this.fsService.getNameFilesJson(this.LOG_DIR, ".log");
    return resultFiles;
  }
  async getContentFile(data) {
    const contentResult = await this.fsService.getContentJson(this.LOG_DIR, data.name_file);
    const groupDataByField = groupByField(contentResult, "type");
    return groupDataByField;
  }
};
LogsService = __decorateClass$e([
  injectable(),
  __decorateParam$a(0, inject(FsService))
], LogsService);

var __getOwnPropDesc$d = Object.getOwnPropertyDescriptor;
var __decorateClass$d = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$d(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$9 = (index, decorator) => (target, key) => decorator(target, key, index);
let LogsController = class {
  constructor(logsService) {
    this.logsService = logsService;
  }
  async listAllLogs(req, res) {
    await handleSend(res, async () => {
      const result = await this.logsService.getFileLogsJson();
      return result;
    }, "Logs listados correctamente.");
  }
  async listContentByLog(req, res) {
    await handleSend(res, async () => {
      const result = await this.logsService.getContentFile(req.body);
      return result;
    }, "Contenido del log listado correctamente.");
  }
};
LogsController = __decorateClass$d([
  injectable(),
  __decorateParam$9(0, inject(LogsService))
], LogsController);

const ListContentByLogDto = yup.object({
  name_file: yup.string().required("El [name_file] es un campo obligatorio")
}).required();

const logsRouter = Router();
const logsController = container.resolve(LogsController);
logsRouter.use(authMiddleware);
logsRouter.get(
  "/list",
  logsController.listAllLogs.bind(logsController)
);
logsRouter.get(
  "/list/content",
  validateFields(ListContentByLogDto, null, true),
  logsController.listContentByLog.bind(logsController)
);

class ProductoConvivioModel extends Model {
  id_productos_convivio;
  name_producto_convivio;
  descripcion_producto_convivio;
  id_category_productos_convivio;
  userCreatedAt;
  userUpdatedAt;
  createdAt;
  updatedAt;
}
ProductoConvivioModel.init(
  {
    id_productos_convivio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name_producto_convivio: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    descripcion_producto_convivio: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    id_category_productos_convivio: {
      type: DataTypes.INTEGER,
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
    tableName: "productos_convivio",
    schema: "app",
    timestamps: true
  }
);

var __getOwnPropDesc$c = Object.getOwnPropertyDescriptor;
var __decorateClass$c = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$c(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let ProductoConvivioRepository = class {
  async create(data, t = null, raw = false) {
    const result = await ProductoConvivioModel.create(data, { transaction: t });
    if (!result) throw new Error(`Error al crear el producto.`);
    return raw ? result.get({ plain: true }) : result;
  }
};
ProductoConvivioRepository = __decorateClass$c([
  injectable()
], ProductoConvivioRepository);

var __getOwnPropDesc$b = Object.getOwnPropertyDescriptor;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$b(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$8 = (index, decorator) => (target, key) => decorator(target, key, index);
let ProductoConvivioService = class {
  constructor(productoConvivioRepository) {
    this.productoConvivioRepository = productoConvivioRepository;
  }
  async createNwProductoConvivio(data, user, t) {
    const createProductoConvivio = await this.productoConvivioRepository.create({
      name_producto_convivio: data.name_producto_convivio,
      id_category_productos_convivio: data.id_category_productos_convivio,
      descripcion_producto_convivio: data?.descripcion_producto_convivio ?? null,
      userCreatedAt: Number(user.id_users)
    }, t);
    return createProductoConvivio;
  }
};
ProductoConvivioService = __decorateClass$b([
  injectable(),
  __decorateParam$8(0, inject(ProductoConvivioRepository))
], ProductoConvivioService);

var __getOwnPropDesc$a = Object.getOwnPropertyDescriptor;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$a(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$7 = (index, decorator) => (target, key) => decorator(target, key, index);
let ProductoConvivioController = class {
  constructor(productoConvivioService) {
    this.productoConvivioService = productoConvivioService;
  }
  async nwProductConvivio(req, res) {
    await handleSend(res, async (t) => {
      const result = await this.productoConvivioService.createNwProductoConvivio(
        req.body,
        req.user,
        t
      );
      return result;
    }, "Producto creado correctamente.", true, "PIOAPP");
  }
};
ProductoConvivioController = __decorateClass$a([
  injectable(),
  __decorateParam$7(0, inject(ProductoConvivioService))
], ProductoConvivioController);

const NwProductConvivioDto = yup.object({
  name_producto_convivio: yup.string().required("El [name_producto_convivio] es un campo obligatorio."),
  id_category_productos_convivio: yup.number().required("El [id_category_productos_convivio] es un campo obligatorio."),
  descripcion_producto_convivio: yup.string()
}).required();

const productoConvivioRouter = Router();
const productoConvivioController = container.resolve(ProductoConvivioController);
productoConvivioRouter.use(authMiddleware);
productoConvivioRouter.post(
  "/create",
  validateFields(NwProductConvivioDto),
  productoConvivioController.nwProductConvivio.bind(productoConvivioController)
);

class CategoryProductosConvivioModel extends Model {
  id_category_productos_convivio;
  name_category_productos_convivio;
  userCreatedAt;
  userUpdatedAt;
  createdAt;
  updatedAt;
}
CategoryProductosConvivioModel.init(
  {
    id_category_productos_convivio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name_category_productos_convivio: {
      type: DataTypes.STRING(500),
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
    tableName: "category_productos_convivio",
    schema: "app",
    timestamps: true
  }
);

class CategoryProductosConvivioRepository {
  async getAll(raw = false) {
    const result = await CategoryProductosConvivioModel.findAll({ raw });
    return result;
  }
}

var __getOwnPropDesc$9 = Object.getOwnPropertyDescriptor;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$9(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$6 = (index, decorator) => (target, key) => decorator(target, key, index);
let CategoryProductoConvivioController = class {
  constructor(categoryProductosConvivioRepository) {
    this.categoryProductosConvivioRepository = categoryProductosConvivioRepository;
  }
  async listAll(req, res) {
    await handleSend(res, async (t) => {
      const result = await this.categoryProductosConvivioRepository.getAll();
      return result;
    }, "Categorias listadas correctamente.");
  }
};
CategoryProductoConvivioController = __decorateClass$9([
  injectable(),
  __decorateParam$6(0, inject(CategoryProductosConvivioRepository))
], CategoryProductoConvivioController);

const categoryProductoConvivioRouter = Router();
const categoryProductoConvivioController = container.resolve(CategoryProductoConvivioController);
categoryProductoConvivioRouter.use(authMiddleware);
categoryProductoConvivioRouter.get(
  "/all",
  categoryProductoConvivioController.listAll.bind(categoryProductoConvivioController)
);

class TipoPersonasConvivioModel extends Model {
  id_tipo_persona_convivio;
  name_tipo_persona_convivio;
  userCreatedAt;
  userUpdatedAt;
  createdAt;
  updatedAt;
}
TipoPersonasConvivioModel.init(
  {
    id_tipo_persona_convivio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name_tipo_persona_convivio: {
      type: DataTypes.STRING(500),
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
    tableName: "tipo_persona_convivio",
    schema: "app",
    timestamps: true
  }
);

class PersonasConvivioModel extends Model {
  id_personas_convivio;
  codigo;
  id_tipo_persona_convivio;
  nombre_persona_convivio;
  empresa;
  userCreatedAt;
  userUpdatedAt;
  createdAt;
  updatedAt;
}
PersonasConvivioModel.init(
  {
    id_personas_convivio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    codigo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tipo_persona_convivio: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre_persona_convivio: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    empresa: {
      type: DataTypes.STRING(500),
      allowNull: true
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
    tableName: "personas_convivio",
    schema: "app",
    timestamps: true
  }
);
PersonasConvivioModel.belongsTo(TipoPersonasConvivioModel, {
  foreignKey: "id_tipo_persona_convivio"
});

var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let PersonasConvivioRepository = class {
  async create(data, t = null, raw = false, includes = []) {
    const result = await PersonasConvivioModel.create(data, { transaction: t });
    if (!result) throw new Error(`Error al crear la persona del convivio.`);
    if (includes.length > 0) await result.reload({ include: includes, transaction: t });
    return raw ? result.get({ plain: true }) : result;
  }
  async findLastPersonInvitado(raw = false) {
    const result = await PersonasConvivioModel.findOne({
      where: {
        id_tipo_persona_convivio: 2
      },
      order: [
        ["codigo", "DESC"]
      ],
      raw
    });
    return result;
  }
  async findAllInvitados(raw = false) {
    const result = await PersonasConvivioModel.findAll({
      where: {
        id_tipo_persona_convivio: 2
      },
      order: [
        ["codigo", "DESC"]
      ],
      raw
    });
    return result;
  }
  async findPersonaByCodigoAndIdTipo(codigo, id_tipo_persona_convivio, includes = [], error = true, raw = false) {
    const result = await PersonasConvivioModel.findOne({
      where: {
        codigo,
        id_tipo_persona_convivio
      },
      ...includes.length > 0 ? {
        include: includes
      } : {},
      raw,
      nest: raw
    });
    if (!result && error) throw new Error(`No se encontro ninguna persona del convivio.`);
    return result;
  }
};
PersonasConvivioRepository = __decorateClass$8([
  injectable()
], PersonasConvivioRepository);

var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$5 = (index, decorator) => (target, key) => decorator(target, key, index);
let PersonasConvivioService = class {
  constructor(personasConvivioRepository, detalleEmpleadoCootraguaViewRepository) {
    this.personasConvivioRepository = personasConvivioRepository;
    this.detalleEmpleadoCootraguaViewRepository = detalleEmpleadoCootraguaViewRepository;
  }
  async createInvitado(data, user, t) {
    const lastInvitado = await this.personasConvivioRepository.findLastPersonInvitado(true);
    const codigoInvitado = Number(lastInvitado?.codigo ?? 0) + 1;
    const createInvitado = await this.personasConvivioRepository.create({
      codigo: codigoInvitado,
      id_tipo_persona_convivio: 2,
      nombre_persona_convivio: data.nombre_persona_convivio,
      empresa: data?.empresa ?? ""
    }, t);
    return createInvitado;
  }
  async findInvitadosAll() {
    return await this.personasConvivioRepository.findAllInvitados();
  }
  async findOrCreatePersonaConvivio(data, t) {
    let personaConvivio = await this.personasConvivioRepository.findPersonaByCodigoAndIdTipo(
      data.codigo,
      data.id_tipo_persona_convivio,
      [TipoPersonasConvivioModel],
      false,
      true
    );
    if (data.id_tipo_persona_convivio == 1 && !personaConvivio) {
      const empleadoNomina = await this.detalleEmpleadoCootraguaViewRepository.findByCodigo(
        data.codigo,
        true,
        true
      );
      personaConvivio = await this.personasConvivioRepository.create({
        codigo: data.codigo,
        id_tipo_persona_convivio: data.id_tipo_persona_convivio,
        nombre_persona_convivio: empleadoNomina?.nombreEmpleadoCompleto ?? ""
      }, t, false, [TipoPersonasConvivioModel]);
    }
    if (!personaConvivio) throw new Error(`Error al encontrar la persona del convivio`);
    return personaConvivio;
  }
};
PersonasConvivioService = __decorateClass$7([
  injectable(),
  __decorateParam$5(0, inject(PersonasConvivioRepository)),
  __decorateParam$5(1, inject(DetalleEmpleadoCootraguaViewRepository))
], PersonasConvivioService);

var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$4 = (index, decorator) => (target, key) => decorator(target, key, index);
let PersonasConvivioController = class {
  constructor(personasConvivioService) {
    this.personasConvivioService = personasConvivioService;
  }
  async createNwPersonaInvitada(req, res) {
    await handleSend(res, async (t) => {
      const result = await this.personasConvivioService.createInvitado(
        req.body,
        req.user,
        t
      );
      return result;
    }, "Invitado creado correctamente.", true, "PIOAPP");
  }
  async getAllInvitados(req, res) {
    await handleSend(res, async () => {
      const result = await this.personasConvivioService.findInvitadosAll();
      return result;
    }, "Invitados listados correctamente.");
  }
  async getPersonaScannerQR(req, res) {
    await handleSend(res, async (t) => {
      const result = await this.personasConvivioService.findOrCreatePersonaConvivio(
        req.body,
        t
      );
      return result;
    }, "Persona listada correctamente", true, "PIOAPP");
  }
};
PersonasConvivioController = __decorateClass$6([
  injectable(),
  __decorateParam$4(0, inject(PersonasConvivioService))
], PersonasConvivioController);

const CreateInvitadoDto = yup.object({
  nombre_persona_convivio: yup.string().required("el [nombre_persona_convivio] es un campo obligatorio"),
  empresa: yup.string()
}).required();

const PersonasQRDto = yup.object({
  id_tipo_persona_convivio: yup.number().required("El [id_tipo_persona_convivio] es un campo obligatorio"),
  codigo: yup.number().required("El [codigo] es un campo obligatorio")
}).required();

const personaConvivioRouter = Router();
const personasConvivioController = container.resolve(PersonasConvivioController);
personaConvivioRouter.use(authMiddleware);
personaConvivioRouter.post(
  "/create/invitado",
  validateFields(CreateInvitadoDto),
  personasConvivioController.createNwPersonaInvitada.bind(personasConvivioController)
);
personaConvivioRouter.get(
  "/list/invitados",
  personasConvivioController.getAllInvitados.bind(personasConvivioController)
);
personaConvivioRouter.get(
  "/scanner/qr",
  validateFields(PersonasQRDto, null, true),
  personasConvivioController.getPersonaScannerQR.bind(personasConvivioController)
);

class ConsumosConvivioModel extends Model {
  id_consumos_convivio;
  id_personas_convivio;
  id_productos_convivio;
  cantidad;
  userCreatedAt;
  userUpdatedAt;
  createdAt;
  updatedAt;
}
ConsumosConvivioModel.init(
  {
    id_consumos_convivio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_personas_convivio: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_productos_convivio: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    tableName: "consumos_convivio",
    schema: "app",
    timestamps: true
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
let ConsumosConvivioRepository = class {
  async create(data, t = null, raw = false, includes = []) {
    const result = await ConsumosConvivioModel.create(data, { transaction: t });
    if (!result) throw new Error(`Error al crear el consumo del convivio.`);
    if (includes.length > 0) await result.reload({ include: includes, transaction: t });
    return raw ? result.get({ plain: true }) : result;
  }
};
ConsumosConvivioRepository = __decorateClass$5([
  injectable()
], ConsumosConvivioRepository);

class ResumenConsumoConvivioView extends Model {
  id_personas_convivio;
  codigo;
  id_tipo_persona_convivio;
  nombre_persona_convivio;
  empresa;
  id_productos_convivio;
  name_producto_convivio;
  descripcion_producto_convivio;
  id_category_productos_convivio;
  name_category_productos_convivio;
  fecha_creacion_producto;
  total_consumido;
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
    sequelize: sequelizeInit("PIOAPP"),
    tableName: "vwResumenConsumoConvivio",
    schema: "app",
    timestamps: false
  }
);

var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let ResumenConsumoConvivioRepository = class {
  async findByIdPersona(id_personas_convivio, raw = false) {
    const result = await ResumenConsumoConvivioView.findAll({
      where: {
        id_personas_convivio
      },
      raw,
      order: [
        ["fecha_creacion_producto", "DESC"]
      ]
    });
    return result;
  }
  async findByIdPersonaAndIdProducto(id_personas_convivio, id_productos_convivio, error, raw) {
    const result = await ResumenConsumoConvivioView.findOne({
      where: {
        id_personas_convivio,
        id_productos_convivio
      },
      raw
    });
    if (!result && error)
      throw new Error(`Error no se encontro ningun consumo con id_personas_convivio: ${id_personas_convivio} y id_productos_convivio: ${id_productos_convivio}`);
    return result;
  }
};
ResumenConsumoConvivioRepository = __decorateClass$4([
  injectable()
], ResumenConsumoConvivioRepository);

var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$3 = (index, decorator) => (target, key) => decorator(target, key, index);
let ConsumosConvivioService = class {
  constructor(consumosConvivioRepository, resumenConsumoConvivioRepository) {
    this.consumosConvivioRepository = consumosConvivioRepository;
    this.resumenConsumoConvivioRepository = resumenConsumoConvivioRepository;
  }
  async createConsumo(data, t, user) {
    const consumo = await this.consumosConvivioRepository.create({
      id_personas_convivio: data.id_personas_convivio,
      id_productos_convivio: data.id_productos_convivio,
      cantidad: 1,
      userCreatedAt: Number(user?.id_users ?? null)
    }, t);
    return consumo;
  }
  async getConsumoByPersona(data) {
    const consumoPersona = await this.resumenConsumoConvivioRepository.findByIdPersona(data.id_personas_convivio);
    return consumoPersona;
  }
  async deleteConsumo(data, t, user) {
    const getConsumo = await this.resumenConsumoConvivioRepository.findByIdPersonaAndIdProducto(
      data.id_personas_convivio,
      data.id_productos_convivio,
      true,
      true
    );
    if (Number(getConsumo?.total_consumido ?? 0) <= 0) throw new Error("Error ya no se puede eliminar mas consumo.");
    const consumo = await this.consumosConvivioRepository.create({
      id_personas_convivio: data.id_personas_convivio,
      id_productos_convivio: data.id_productos_convivio,
      cantidad: -1,
      userCreatedAt: Number(user?.id_users ?? null)
    }, t);
    return consumo;
  }
};
ConsumosConvivioService = __decorateClass$3([
  injectable(),
  __decorateParam$3(0, inject(ConsumosConvivioRepository)),
  __decorateParam$3(1, inject(ResumenConsumoConvivioRepository))
], ConsumosConvivioService);

var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$2 = (index, decorator) => (target, key) => decorator(target, key, index);
let ConsumosConvivioController = class {
  constructor(consumosConvivioService) {
    this.consumosConvivioService = consumosConvivioService;
  }
  async createConsumoConvivioPersona(req, res) {
    await handleSend(res, async (t) => {
      const result = await this.consumosConvivioService.createConsumo(
        req.body,
        t,
        req.user
      );
      return result;
    }, "Consumo creado correctamente.", true, "PIOAPP");
  }
  async listConsumoPersona(req, res) {
    await handleSend(res, async () => {
      const result = await this.consumosConvivioService.getConsumoByPersona(req.body);
      return result;
    }, "Consumo listado correctmante.");
  }
  async deleteConsumoConvivioPersona(req, res) {
    await handleSend(res, async (t) => {
      const result = await this.consumosConvivioService.deleteConsumo(
        req.body,
        t,
        req.user
      );
      return result;
    }, "Consumo eliminado correctamente.", true, "PIOAPP");
  }
};
ConsumosConvivioController = __decorateClass$2([
  injectable(),
  __decorateParam$2(0, inject(ConsumosConvivioService))
], ConsumosConvivioController);

const CreateConsumoConvivioDto = yup.object({
  id_personas_convivio: yup.number().required("El [id_personas_convivio] es un campo obligatorio"),
  id_productos_convivio: yup.number().required("El [id_productos_convivio] es un campo obligatorio")
}).required();

const ListConsumoPersonaConvivioDto = yup.object({
  id_personas_convivio: yup.number().required("El [id_personas_convivio] es un campo obligatorio")
}).required();

const consumosConvivioRouter = Router();
const consumosConvivioController = container.resolve(ConsumosConvivioController);
consumosConvivioRouter.use(authMiddleware);
consumosConvivioRouter.post(
  "/create",
  validateFields(CreateConsumoConvivioDto),
  consumosConvivioController.createConsumoConvivioPersona.bind(consumosConvivioController)
);
consumosConvivioRouter.delete(
  "/create",
  validateFields(CreateConsumoConvivioDto),
  consumosConvivioController.deleteConsumoConvivioPersona.bind(consumosConvivioController)
);
consumosConvivioRouter.get(
  "/list",
  validateFields(ListConsumoPersonaConvivioDto, null, true),
  consumosConvivioController.listConsumoPersona.bind(consumosConvivioController)
);

const router = Router();
router.use("/auth", authRouter);
router.use("/tipo/visitas", tipoVisitasRouter);
router.use("/tiendas/modulo", tiendasModuloRouter);
router.use("/visitas", visitasRouter);
router.use("/jwt", jwtRouter);
router.use("/permissions", permissionRouter);
router.use("/rutas/view", rutasViewRouter);
router.use("/nomina/periodos", periodoRouter);
router.use("/nomina/firma-boleta", firmaBoletaRouter);
router.use("/nomina/boleta", boletaConsultaRouter);
router.use("/articulos/ruta", articulosRutaRouter);
router.use("/recepcion/articulos", recepcionesRouter);
router.use("/logs", logsRouter);
router.use("/producto/convivio", productoConvivioRouter);
router.use("/category/product/convivio", categoryProductoConvivioRouter);
router.use("/personas/convivio", personaConvivioRouter);
router.use("/consumos/convivio", consumosConvivioRouter);

const errorHandlerMiddleware = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  const message = err.message || err.stack || "Internal Server Error";
  const status = err.status || 500;
  logger.error("", {
    type: "global",
    message: "",
    stack: err?.stack,
    name: err?.name,
    isWithRollBack: false,
    connection: null,
    commitController: false,
    errorRaw: err
  });
  res.status(status).json({
    message,
    status: false,
    errors: err.errors || [message],
    data: null
  });
};

class HandleSocketGlobal {
  static io;
  static init(server) {
    if (!this.io)
      this.io = new Server(server, {
        cors: { origin: "*" }
      });
    return this.io;
  }
  static getIO() {
    if (!this.io)
      throw new Error("Socket.IO no ha sido inicializado.");
    return this.io;
  }
}

class SocketService {
  endpoint;
  io = HandleSocketGlobal.getIO();
  server;
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.server = this.io.of(this.endpoint);
  }
  connection(callback) {
    this.server.on("connection", (socket) => {
      console.log(`Cliente conectado ${socket.id}`);
      callback(socket);
      socket.on("disconnect", () => console.log(`Cliente desconectado ${socket.id}`));
    });
  }
  onEvent(socket, room, callback) {
    socket.on(room, callback);
  }
  joinRoom(socket, room) {
    socket.join(room);
    Array.isArray(room) ? console.log(`Socket ${socket.id} se uni\xF3 a ${room.length} salas: ${room.join(", ")}`) : console.log(`Socket ${socket.id} se uni\xF3 a la sala: ${room}`);
  }
  emitByRoom(room, event, data) {
    this.server.to(room).emit(event, data);
  }
  getServer() {
    return this.server;
  }
}

const socketAuthMiddeware = (socket, next) => {
  try {
    const authHeader = socket.handshake.headers.authorization || "";
    const [type, token] = authHeader.split(" ");
    if ((type || "") !== "Bearer") throw new Error("Auth method invalid.");
    if (!token) throw new Error("No token provided.");
    const user = verifyToken(token);
    if (!user) throw new Error("Unauthorized");
    socket.user = user;
    next();
  } catch (err) {
    logger.error("Error en middleware de autenticacion de Socket.", {
      type: "auth",
      message: "",
      stack: err?.stack,
      name: err?.name,
      isWithRollBack: false,
      connection: null,
      commitController: false,
      errorRaw: err
    });
    const error = new Error(err.message || "Unauthorized");
    error.data = {
      status: false,
      message: err.message || "Unauthorized",
      code: 401
    };
    next(error);
  }
};

var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam$1 = (index, decorator) => (target, key) => decorator(target, key, index);
let RutasSocketService = class {
  constructor(rutasViewRepository) {
    this.rutasViewRepository = rutasViewRepository;
  }
  async getRutasSocket(data) {
    const result = await this.rutasViewRepository.getAllRutasByFilters({
      fecha_entrega: "2025-11-24"
    });
    return result;
  }
};
RutasSocketService = __decorateClass$1([
  injectable(),
  __decorateParam$1(0, inject(RutasViewRepository))
], RutasSocketService);

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
let RutasGateway = class {
  constructor(endpoint, rutasSocketService) {
    this.endpoint = endpoint;
    this.rutasSocketService = rutasSocketService;
    this.socketService = new SocketService(this.endpoint);
    this.init();
  }
  socketService;
  init() {
    this.socketService.getServer().use(socketAuthMiddeware);
    this.socketService.connection((socket) => {
      const roomUser = `ruta_room_${socket.user?.id_users}`;
      this.socketService.joinRoom(socket, roomUser);
      this.socketService.onEvent(socket, "rutas", async (data) => {
        const rutas = await this.rutasSocketService.getRutasSocket(data);
        this.socketService.emitByRoom(roomUser, "rutas-listar", rutas);
      });
    });
  }
};
RutasGateway = __decorateClass([
  injectable(),
  __decorateParam(0, inject("RutasEndpoint")),
  __decorateParam(1, inject(RutasSocketService))
], RutasGateway);

class SocketServer {
  static socketModule() {
    return [
      RutasGateway
    ];
  }
  static appGateway() {
    container.register("RutasEndpoint", { useValue: "/rutas" });
    for (const Module of this.socketModule()) {
      container.resolve(Module);
    }
  }
}

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8e3;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/api", router);
HandleSocketGlobal.init(server);
SocketServer.appGateway();
app.use(errorHandlerMiddleware);
server.listen(PORT, () => {
  connectionDb();
  console.log(`Server running on http://localhost:${PORT}`);
});
