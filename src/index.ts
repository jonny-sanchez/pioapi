import "reflect-metadata";
import express from 'express'
import 'dotenv/config'
// import { config } from 'dotenv'
import Routers from './routers/routers'
import { connectionDb } from './config/database'
import cors from 'cors'
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";
import fileUpload from 'express-fileupload'
import http from 'http'
import HandleSocketGlobal from "./config/HandleSocketGlobal";
import SocketServer from "./Sockets/SocketServer";
import limiterMiddleware from "./middlewares/limiterMiddleware";
import helmet from "helmet";
import ServerJob from "./jobs/ServerJob";
import EventServer from "./events/EventServer";
import { connectRedis } from "./config/redisClient";
// import multer from 'multer'

// config()

const app = express()

const server = http.createServer(app)

// const upload = multer()

const PORT = process.env.PORT || 5000

// Confía en el primer proxy para obtener la IP real del cliente (necesario para rate limit)
app.set('trust proxy', 1)

//seguridad
app.use(helmet())

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

// app.use(upload.any())

app.use(fileUpload())

//mandar error de timeout si la api se tarda mucho
// app.use(timeout('5s'))

//middleware global para generar error en las apis
// app.use(timeoutMiddleware)

//proteger apis de saturacion de solicitudes
app.use('/api', limiterMiddleware)

//all apis
app.use('/api', Routers)

//listen sockets all
HandleSocketGlobal.init(server)

SocketServer.appGateway()

//cron jobs
ServerJob.handle()

//inicializar listener de eventos
EventServer.initEventServer()

app.use(errorHandlerMiddleware)

server.listen(PORT, ()=> {

    connectRedis()

    connectionDb()

    console.log(`Server running on http://localhost:${PORT}`)
    
})
