import * as yup from 'yup'

export const FindNominaDto = yup.object({
    periodo: yup.string().required("la [periodo] es un campo obligatorio.")
})

export type FindNominaDtoType = yup.InferType<typeof FindNominaDto>