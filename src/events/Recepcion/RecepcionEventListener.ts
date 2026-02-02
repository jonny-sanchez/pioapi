import { inject, injectable } from "tsyringe";
import IEvent from "../../interface/Event/IEvent";
import RecepcionEventEmitter from "./RecepcionEventEmitter";
import { EMIT_NOTIFICATION } from "./RecepcionEventConstant";
import { ParamsEventNotificactionEventType } from "../../types/Events/RecepcionEventsType";
import { handleTransaction } from "../../utils/DB/TransactionsHelpers";
import NotificationPushExpoService from "../../services/NotificationPushExpo/NotificationPushExpoService";
import { Transaction } from "sequelize";

@injectable()
export default class RecepcionEventListener implements IEvent {

    constructor(@inject(NotificationPushExpoService) private notificationPushExpoService:NotificationPushExpoService) {}

    handleEvent(): void {

        RecepcionEventEmitter.on(EMIT_NOTIFICATION, async(body:ParamsEventNotificactionEventType) => {
            await handleTransaction(async(t) => {
                await this.notificationPushExpoService.sendNotificactionPushApp(
                    body.data, t as Transaction
                )
            }, 'PIOAPP')
        })

    }

}