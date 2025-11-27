import { container } from "tsyringe"
import RutasGateway from "./Rutas/RutasGateway"

export default class SocketServer {

    static socketModule () {
        return [
            RutasGateway
        ]
    }

    static appGateway() {

        container.register<string>('RutasEndpoint', { useValue: '/rutas' })

        for(const Module of this.socketModule()) {
            container.resolve(Module)
        }

    }

}