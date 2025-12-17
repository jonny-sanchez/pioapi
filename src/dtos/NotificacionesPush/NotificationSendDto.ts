import * as yup from "yup";

export const NotificationSendDto = yup.object({
    user: yup.number().required("el [user] es un campo obligatorio"),
    body: yup.string().required("el [body] es un campo obligatorio"),
    title: yup.string().required("el [title] es un campo obligatorio"),
    id_asunto_notificacion: yup.number().required("el [id_asunto_notificacion] es un campo obligatorio"),
    data_payload: yup
        .object()
        // .required("El [dataPayload] es obligatorio")
        .typeError("El [data_payload] debe ser un objeto JSON válido")
}).required()

export type NotificationSendDtoType = yup.InferType<typeof NotificationSendDto>