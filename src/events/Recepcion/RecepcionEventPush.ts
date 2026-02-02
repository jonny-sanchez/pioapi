import { ParamsEventNotificactionEventType } from "../../types/Events/RecepcionEventsType";
import { EMIT_NOTIFICATION } from "./RecepcionEventConstant";
import RecepcionEventEmitter from "./RecepcionEventEmitter";

export default class RecepcionEventPush {

    static EVENT_EMIT_NOTIFICATION(objectData:ParamsEventNotificactionEventType) {
        RecepcionEventEmitter.emit(EMIT_NOTIFICATION, objectData)
    }

}