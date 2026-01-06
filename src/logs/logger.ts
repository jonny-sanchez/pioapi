import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = createLogger({
    level: 'info',
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
            zippedArchive: true,
            utc: false
        })
    ]
})

export default logger