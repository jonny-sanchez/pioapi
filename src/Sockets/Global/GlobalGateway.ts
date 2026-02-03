import { inject, injectable } from "tsyringe";
import ISocket from "../../interface/Socket/ISocket";
import SocketService from "../../services/Socket/SocketService";
import socketAuthMiddeware from "../../middlewares/socketAuthMiddeware";
import SocketAuthType from "../../types/Sockets/SocketAuthType";
import RecepcionEventEmitter from "../../events/Recepcion/RecepcionEventEmitter";
import { EMIT_NOTIFICATION } from "../../events/Recepcion/RecepcionEventConstant";
import { ParamsEventNotificactionEventType } from "../../types/Events/RecepcionEventsType";
import { saveRecepcionDtoType } from "../../dtos/recepciones/SaveRecepcionDto";
import NotificationEventEmitter from "../../events/NotificationsPush/NotificationEventEmitter";
import NotificacionAppModel from "../../models/pioapp/tables/NotificacionAppModel";
import NotificacionAppRepository from "../../repositories/NotificacionAppRepository";

@injectable()
export default class GlobalGateway implements ISocket {

    private socketService:SocketService

    constructor(
        @inject('GlobalEndpoint') private endpoint:string,
        @inject(NotificacionAppRepository) private notificacionAppRepository:NotificacionAppRepository
    ) {
        this.socketService = new SocketService(this.endpoint)
    }

    init(): void {

        this.socketService.getServer().use(socketAuthMiddeware)

        //avisar para cunado se leyo una notificacion interna
        NotificationEventEmitter.on('notificacion-leida', (notificacion:NotificacionAppModel) => {
            const roomUser = `global_room_${notificacion.id_users}`
            this.socketService.emitByRoom(roomUser, 'leida-notificacion', notificacion)
        })
        //leer cunado entra una notificacion
        NotificationEventEmitter.on('notificacion-nueva', (notificacion:NotificacionAppModel) => {
            const roomUser = `global_room_${notificacion.id_users}`
            this.socketService.emitByRoom(roomUser, 'nueva-notificacion', notificacion)
        }) 
        //evento caundo se realiza una recepcion y emitir evento dentro de la sala
        RecepcionEventEmitter.on(EMIT_NOTIFICATION, async(body:ParamsEventNotificactionEventType) => {
            const data = body.data.data_payload as saveRecepcionDtoType
            const roomUser = `global_room_${data.cabecera.codigo_empleado_piloto}`
            this.socketService.emitByRoom(roomUser, 'nueva_recepcion', data.cabecera)
        })
        //inicilaizar conexion
        this.socketService.connection((socket:SocketAuthType) => {
            const roomUser = `global_room_${socket.user?.id_users}`
            this.socketService.joinRoom(socket, roomUser)

            this.socketService.onEvent(socket, 'notificaciones-count', async (data) => {
                const countNotificaciones = await this.notificacionAppRepository.count({
                    id_users: Number(socket.user?.id_users ?? 0), leido: false
                })
                this.socketService.emitByRoom(roomUser, 'notificaciones-list-count', countNotificaciones)
            })
        })
        
    }

} 