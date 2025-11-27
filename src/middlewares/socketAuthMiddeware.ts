import { verifyToken } from "../utils/Jwt";
import SocketAuthType from "../types/Sockets/SocketAuthType";
import HandleLogData from "../types/Logs/HandleLogData";
import logger from "../logs/logger";

const socketAuthMiddeware = (socket:SocketAuthType, next:(err?: Error) => void) => {

    try {
        
        const authHeader:string = socket.handshake.headers.authorization || ''
        const [type, token] = authHeader.split(' ')

        if((type || '') !== 'Bearer') throw new Error("Auth method invalid.")

        if(!token) throw new Error("No token provided.") 

        const user = verifyToken(token)
            
        if(!user) throw new Error("Unauthorized")

        socket.user = user;

        next()

    } catch (err:any) {

        logger.error('Error en middleware de autenticacion de Socket.', {
            type: 'auth',
            message: '',
            stack: err?.stack,
            name: err?.name,
            isWithRollBack: false,
            connection: null,
            commitController: false,
            errorRaw: err
        } as HandleLogData)

        const error: any = new Error(err.message || "Unauthorized")
        error.data = {
            status: false,
            message: err.message || "Unauthorized",
            code: 401,
        }
        next(error)
        
    }

}

export default socketAuthMiddeware