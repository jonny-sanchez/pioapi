import { container } from "tsyringe"
import RutasGateway from "./Rutas/RutasGateway"
import NotificacionesPushGateway from "./Notificaciones/NotificacionesPushGateway"
import ISocket from "../interface/Socket/ISocket"
import GlobalGateway from "./Global/GlobalGateway"

export default class SocketServer {

    static socketModule () {
        return [
            // RutasGateway,
            NotificacionesPushGateway,
            GlobalGateway
        ]
    }

    static appGateway() {

        container.register<string>('RutasEndpoint', { useValue: '/rutas' })
        container.register<string>('NotificacionesEndpoint', { useValue: '/notificaciones' })
        container.register<string>('GlobalEndpoint', { useValue: '/global' })

        for(const Module of this.socketModule()) {
            const instance = container.resolve<ISocket>(Module)
            instance.init()
        }

    }

}