import SocketService from "../../services/Socket/SocketService"
import socketAuthMiddeware from "../../middlewares/socketAuthMiddeware"
import SocketAuthType from "../../types/Sockets/SocketAuthType"
import { inject, injectable } from "tsyringe"
import RutasSocketService from "../../services/Rutas/RutasSocketService"

@injectable()
export default class RutasGateway {

    private socketService:SocketService

    constructor(
      @inject('RutasEndpoint') private endpoint:string,
      @inject(RutasSocketService) private rutasSocketService:RutasSocketService
    ) {
        this.socketService = new SocketService(this.endpoint)
        this.init()
    }

    private init() {
        this.socketService.getServer().use(socketAuthMiddeware)

        this.socketService.connection((socket:SocketAuthType) => {

            const roomUser = `ruta_room_${socket.user?.id_users}`

            this.socketService.joinRoom(socket, roomUser)

            this.socketService.onEvent(socket, 'rutas', async (data) => {
              const rutas = await this.rutasSocketService.getRutasSocket(data)
              this.socketService.emitByRoom(roomUser, 'rutas-listar', rutas)
            })

        })
    }

}