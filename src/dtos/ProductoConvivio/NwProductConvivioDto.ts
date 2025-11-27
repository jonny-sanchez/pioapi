import * as yup from 'yup'

export const NwProductConvivioDto = yup.object({
    name_producto_convivio: yup.string().required("El [name_producto_convivio] es un campo obligatorio."),
    id_category_productos_convivio: yup.number().required("El [id_category_productos_convivio] es un campo obligatorio."),
    descripcion_producto_convivio: yup.string()
}).required()

export type NwProductConvivioDtoType = yup.InferType<typeof NwProductConvivioDto>
