import "reflect-metadata";
import express from 'express'
import 'dotenv/config'
// import { config } from 'dotenv'
import Routers from './routers/routers'
import { connectionDb } from './config/database'

// config()

const app = express()

const PORT = process.env.PORT || 8000

app.use(express.json())

app.use('/api', Routers)

app.listen(PORT, ()=> {

    connectionDb()

    console.log(`Server running on http://localhost:${PORT}`)
    
})
