import * as yup from "yup";

export const TiendaByCodigoDto = yup.object({
    codigo_empresa: yup.string().required("El [codigo_empresa] es un campo obligatorio"),
    codigo_tienda: yup.string().required("El [codigo_tienda] es un campo obligatorio"),
}).required()

export type TiendaByCodigoDtoType = yup.InferType<typeof TiendaByCodigoDto>