import { inject, injectable } from "tsyringe"
import SocketService from "../../services/Socket/SocketService"
import socketAuthMiddeware from "../../middlewares/socketAuthMiddeware"
import SocketAuthType from "../../types/Sockets/SocketAuthType"
import NotificacionAppRepository from "../../repositories/NotificacionAppRepository"
import NotificationEventEmitter from "../../events/NotificationsPush/NotificationEventEmitter"
import NotificacionAppModel from "../../models/pioapp/tables/NotificacionAppModel"
import AsuntoNotificacionModel from "../../models/pioapp/tables/AsuntoNotificacionModel"

@injectable()
export default class NotificacionesPushGateway {

    private socketService:SocketService

    constructor(
      @inject('NotificacionesEndpoint') private endpoint:string,
      @inject(NotificacionAppRepository) private notificacionAppRepository:NotificacionAppRepository
    ) {
        this.socketService = new SocketService(this.endpoint)
        this.init()
    }

    private init() {

        this.socketService.getServer().use(socketAuthMiddeware)

        //evento para cuando se crea una nueva notificacion interna
        NotificationEventEmitter.on('notificacion-nueva', (notificacion:NotificacionAppModel) => {
            const roomUser = `notificaciones_room_${notificacion.id_users}`
            this.socketService.emitByRoom(roomUser, 'notificacion-nueva', notificacion)
        }) 

        //avisar para cunado se leyo una notificacion interna
        NotificationEventEmitter.on('notificacion-leida', (notificacion:NotificacionAppModel) => {
            const roomUser = `notificaciones_room_${notificacion.id_users}`
            this.socketService.emitByRoom(roomUser, 'notificacion-leida', notificacion)
        })

        //socket para cargar las notificaciones del dia
        this.socketService.connection((socket:SocketAuthType) => {

            const roomUser = `notificaciones_room_${socket.user?.id_users}`

            this.socketService.joinRoom(socket, roomUser)

            this.socketService.onEvent(socket, 'notificaciones_hoy', async (data) => {
                const notificaciones = await this.notificacionAppRepository.getAllTodayByIdUser(
                    Number(socket.user?.id_users),
                    [AsuntoNotificacionModel]
                )
                this.socketService.emitByRoom(roomUser, 'notificaciones-listar', notificaciones)
            })

        })

    }

}