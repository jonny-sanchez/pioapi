import * as yup from "yup";

export const LoginDto = yup.object({
    // codigo: yup.number().integer().required('el [codigo] es un campo obligatorio'),
    codigo: yup
        .string()
        .matches(/^[a-zA-Z]{2}\d+$/, 'el [codigo] debe empezar con 2 letra y luego numeros.')
        .required('el [codigo] es un campo obligatorio'),
    password: yup.string().required('el [password] es un campo obligatorio')
})

export type LoginDtoType = yup.InferType<typeof LoginDto>