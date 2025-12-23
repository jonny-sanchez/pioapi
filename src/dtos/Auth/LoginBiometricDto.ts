// LoginBiometricDto
import * as yup from "yup";

export const LoginBiometricDto = yup.object({
    user: yup.number().required("el [user] es un campo obligatorio"),
    id_unique_device: yup.string().nullable(),
    exponent_push_token: yup.string().nullable()
}).test(
    'device-and-push-token',
    'id_unique_device y exponent_push_token deben enviarse juntos',
    function (values) {
      const { id_unique_device, exponent_push_token } = values ?? {};

      const hasDevice = !!id_unique_device;
      const hasToken = !!exponent_push_token;

      // o vienen los dos, o ninguno
      return hasDevice === hasToken;
    }
)

export type LoginBiometricDtoType = yup.InferType<typeof LoginBiometricDto>