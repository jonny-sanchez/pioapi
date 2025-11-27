import * as yup from "yup";

export const ListConsumoPersonaConvivioDto = yup.object({
    id_personas_convivio: yup.number().required("El [id_personas_convivio] es un campo obligatorio")
}).required()

export type ListConsumoPersonaConvivioDtoType = yup.InferType<typeof ListConsumoPersonaConvivioDto>