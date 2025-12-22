// LoginBiometricDto
import * as yup from "yup";

export const LoginBiometricDto = yup.object({
    user: yup.number().required("el [user] es un campo obligatorio"),
}).required()

export type LoginBiometricDtoType = yup.InferType<typeof LoginBiometricDto>