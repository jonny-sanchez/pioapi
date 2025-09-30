import * as yup from 'yup'

export const ValidJwtDto = yup.object({
    tokenText: yup.string().required('el [tokenText] es un campo obligatorio.')
})

export type ValidJwtDtoType = yup.InferType<typeof ValidJwtDto>