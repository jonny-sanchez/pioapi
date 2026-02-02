import { container } from "tsyringe"
import IEvent from "../interface/Event/IEvent"
import RecepcionEventListener from "./Recepcion/RecepcionEventListener"

export default class EventServer {

    static eventModule() {

        return [
            RecepcionEventListener
        ]
    }

    static initEventServer() {
        for(const Module of this.eventModule()) {
            const instance =  container.resolve<IEvent>(Module)
            instance.handleEvent()
        }
    }

}