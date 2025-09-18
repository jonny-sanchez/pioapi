import * as yup from "yup";

export const LoginDto = yup.object({
    codigo: yup.number().integer().required('el [codigo] es un campo obligatorio'),
    password: yup.string().required('el [password] es un campo obligatorio')
})

export type LoginDtoType = yup.InferType<typeof LoginDto>