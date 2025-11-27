import { Server } from "socket.io";
import http from 'http'

export default class HandleSocketGlobal {

    private static io: Server

    static init(server: http.Server) {
        if (!this.io) 
            this.io = new Server(server, {
                cors: { origin: "*" }
            })
        
        return this.io
    }

    static getIO() : Server {
        if (!this.io) 
            throw new Error("Socket.IO no ha sido inicializado.")
        
        return this.io
    }

}