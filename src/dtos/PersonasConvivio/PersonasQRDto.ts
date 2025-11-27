import * as yup from "yup";

export const PersonasQRDto = yup.object({
    id_tipo_persona_convivio: yup.number().required("El [id_tipo_persona_convivio] es un campo obligatorio"),
    codigo: yup.number().required("El [codigo] es un campo obligatorio")
}).required()

export type PersonasQRDtoType = yup.InferType<typeof PersonasQRDto>