import * as yup from "yup";

export const CreateConsumoConvivioDto = yup.object({
    id_personas_convivio: yup.number().required("El [id_personas_convivio] es un campo obligatorio"),
    id_productos_convivio: yup.number().required("El [id_productos_convivio] es un campo obligatorio")
}).required()

export type CreateConsumoConvivioDtoType = yup.InferType<typeof CreateConsumoConvivioDto>