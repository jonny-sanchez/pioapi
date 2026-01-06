import { container } from "tsyringe"
import RutasGateway from "./Rutas/RutasGateway"
import NotificacionesPushGateway from "./Notificaciones/NotificacionesPushGateway"
import ISocket from "../interface/Socket/ISocket"

export default class SocketServer {

    static socketModule () {
        return [
            // RutasGateway,
            NotificacionesPushGateway
        ]
    }

    static appGateway() {

        container.register<string>('RutasEndpoint', { useValue: '/rutas' })
        container.register<string>('NotificacionesEndpoint', { useValue: '/notificaciones' })

        for(const Module of this.socketModule()) {
            const instance =  container.resolve<ISocket>(Module)
            instance.init()
        }

    }

}