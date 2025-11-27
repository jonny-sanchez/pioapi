import { Namespace, Server, Socket } from "socket.io";
import HandleSocketGlobal from "../../config/HandleSocketGlobal";
import SocketAuthType from "../../types/Sockets/SocketAuthType";

export default class SocketService {

    private endpoint:string
    private io:Server = HandleSocketGlobal.getIO()
    private server:Namespace

    constructor(endpoint:string) {
        this.endpoint = endpoint
        this.server = this.io.of(this.endpoint)
    }
    
    public connection(callback:(socket:Socket|SocketAuthType)=>any) {
        this.server.on('connection', (socket:Socket|SocketAuthType) => {
            console.log(`Cliente conectado ${socket.id}`)
            callback(socket)
            socket.on('disconnect', () => console.log(`Cliente desconectado ${socket.id}`))
        })
    }

    public onEvent(socket:Socket|SocketAuthType, room:string, callback:(data:any)=>any) {
        socket.on(room, callback)
    }

    public joinRoom(socket:Socket|SocketAuthType, room:string|string[]) {
        socket.join(room)
        Array.isArray(room) ?
            console.log(`Socket ${socket.id} se unió a ${room.length} salas: ${room.join(", ")}`) :
            console.log(`Socket ${socket.id} se unió a la sala: ${room}`)
    }

    public emitByRoom(room:string|string[], event:string, data:any) {
        this.server.to(room).emit(event, data)
    }

    public getServer() {
        return this.server
    }

}