import * as yup from "yup";

export const CreateInvitadoDto = yup.object({
    nombre_persona_convivio: yup.string().required("el [nombre_persona_convivio] es un campo obligatorio"),
    empresa: yup.string()
}).required()

export type CreateInvitadoDtoType = yup.InferType<typeof CreateInvitadoDto>