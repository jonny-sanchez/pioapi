import "reflect-metadata";
import express from 'express'
import 'dotenv/config'
// import { config } from 'dotenv'
import Routers from './routers/routers'
import { connectionDb } from './config/database'
import cors from 'cors'
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";
import fileUpload from 'express-fileupload'
// import multer from 'multer'

// config()

const app = express()

// const upload = multer()

const PORT = process.env.PORT || 8000

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

// app.use(upload.any())

app.use(fileUpload())

app.use('/api', Routers)

app.use(errorHandlerMiddleware)

app.listen(PORT, ()=> {

    connectionDb()

    console.log(`Server running on http://localhost:${PORT}`)
    
})
