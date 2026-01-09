import * as yup from 'yup';
import { TipoPeriodoEnum } from '../types/PeriodosNomina/PeriodosPagadosType';

const tiposNumericos = Object.values(TipoPeriodoEnum).filter(
    (v) => typeof v === 'number'
) as number[];

export const FirmaBoletaDto = yup.object({
    id_periodo: yup
        .number()
        .integer()
        .positive("El [id_periodo] debe ser un número positivo.")
        .required("El [id_periodo] es un campo obligatorio."),
    
    phone_gps_longitude: yup
        .string()
        // .matches(/^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/, "La [phone_gps_longitude] debe ser una coordenada válida.")
        .required("La [phone_gps_longitude] es un campo obligatorio."),
    
    phone_gps_latitude: yup
        .string()
        // .matches(/^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/, "La [phone_gps_latitude] debe ser una coordenada válida.")
        .required("La [phone_gps_latitude] es un campo obligatorio."),
    
    ip_dispositivo: yup
        .string()
        .matches(/^(\d{1,3}\.){3}\d{1,3}$/, "La [ip_dispositivo] debe ser una dirección IP válida.")
        .required("La [ip_dispositivo] es un campo obligatorio."),

    tipo: yup.number()
            .oneOf(tiposNumericos, 'El tipo de periodo no es válido')
            .notRequired()
            .nullable()
            .default(TipoPeriodoEnum.QUINCENA),
    
});

export const InvalidarFirmaDto = yup.object({
    id_firma_boleta_pago: yup
        .string()
        .uuid("El [id_firma_boleta_pago] debe ser un UUID válido.")
        .required("El [id_firma_boleta_pago] es un campo obligatorio."),
    
    motivo: yup
        .string()
        .min(10, "El [motivo] debe tener al menos 10 caracteres.")
        .max(500, "El [motivo] no puede exceder 500 caracteres.")
        .required("El [motivo] es un campo obligatorio.")
});

export const VerificarIntegridadDto = yup.object({
    id_firma_boleta_pago: yup
        .string()
        .uuid("El [id_firma_boleta_pago] debe ser un UUID válido.")
        .required("El [id_firma_boleta_pago] es un campo obligatorio.")
});

export type FirmaBoletaDtoType = yup.InferType<typeof FirmaBoletaDto>;
export type InvalidarFirmaDtoType = yup.InferType<typeof InvalidarFirmaDto>;
export type VerificarIntegridadDtoType = yup.InferType<typeof VerificarIntegridadDto>;