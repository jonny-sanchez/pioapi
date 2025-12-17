import * as yup from "yup";

export const MarkerReadNotificationDto = yup.object({
    id_notificacion_app: yup.number().required("el [id_notificacion_app] es un campo obligatorio"),
}).required()

export type MarkerReadNotificationDtoType = yup.InferType<typeof MarkerReadNotificationDto>