import * as yup from 'yup';

export const VerificarFirmaExistenteDto = yup.object({
    id_periodo: yup.number()
        .required('El id del periodo es obligatorio')
        .integer('El id del periodo debe ser un número entero')
        .positive('El id del periodo debe ser positivo')
});

export type VerificarFirmaExistenteType = yup.InferType<typeof VerificarFirmaExistenteDto>;