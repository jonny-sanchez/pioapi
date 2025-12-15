import * as yup from "yup";

export const LoginDto = yup.object({
    // codigo: yup.number().integer().required('el [codigo] es un campo obligatorio'),
    codigo: yup
        .string()
        .matches(/^[a-zA-Z]{2}\d+$/, 'el [codigo] debe empezar con 2 letra y luego numeros.')
        .required('el [codigo] es un campo obligatorio'),
    password: yup.string().required('el [password] es un campo obligatorio'),
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

export type LoginDtoType = yup.InferType<typeof LoginDto>