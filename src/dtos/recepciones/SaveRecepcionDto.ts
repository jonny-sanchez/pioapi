import * as yup from 'yup';

export const saveRecepcionDto = yup.object({
    cabecera: yup.object().shape({
        id_pedido: yup.number().required("El [id_pedido] es un campo obligatorio."),
        serie: yup.string().required("La [serie] es un campo obligatorio."),
        empresa: yup.string().required("La [empresa] es un campo obligatorio y debe tener 5 caracteres."),
        tienda: yup.string().required("La [tienda] es un campo obligatorio y debe tener 5 caracteres."),

        //campos no requeridos
        fecha_entrega: yup.mixed().nullable().notRequired(),
        piloto: yup.mixed().nullable().notRequired(),
        no_ruta: yup.mixed().nullable().notRequired(),
        nombre_ruta: yup.mixed().nullable().notRequired(),
        cede: yup.mixed().nullable().notRequired(),
        id_tipo_entrega: yup.mixed().nullable().notRequired(),
        name_tipo_entrega: yup.mixed().nullable().notRequired(),
        tienda_nombre: yup.mixed().nullable().notRequired(),
        tienda_direccion: yup.mixed().nullable().notRequired(),
        codigo_empleado_piloto: yup.mixed().nullable().notRequired(),
        recepccionada: yup.mixed().nullable().notRequired()

    }).required("El objeto [cabecera] es requerido."),

    detalle: yup.array().of(
        yup.object().shape({
            codigo_articulo: yup.string().required("El [codigo_articulo] es un campo obligatorio."),
            cantidad: yup.number().required("La [cantidad] es un campo obligatorio."),
            description: yup.string().required("El [description] es un campo obligatorio."),
        })
    ).required("El arreglo [detalle] debe tener al menos un elemento.")
})

export type saveRecepcionDtoType = yup.InferType<typeof saveRecepcionDto>;
