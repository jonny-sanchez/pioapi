import * as yup from 'yup';

export const saveRecepcionDto = yup.object({
    cabecera: yup.object().shape({
        id_pedido: yup.number().required("El [id_pedido] es un campo obligatorio."),
        serie: yup.string().required("La [serie] es un campo obligatorio."),
        empresa: yup.string().length(5).required("La [empresa] es un campo obligatorio y debe tener 5 caracteres."),
        tienda: yup.string().length(5).required("La [tienda] es un campo obligatorio y debe tener 5 caracteres."),
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
