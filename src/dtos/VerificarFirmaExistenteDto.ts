import * as yup from 'yup';
import { TipoPeriodoEnum } from '../types/PeriodosNomina/PeriodosPagadosType';

const tiposNumericos = Object.values(TipoPeriodoEnum).filter(
    (v) => typeof v === 'number'
) as number[];

export const VerificarFirmaExistenteDto = yup.object({
    id_periodo: yup.number()
        .required('El id del periodo es obligatorio')
        .integer('El id del periodo debe ser un número entero')
        .positive('El id del periodo debe ser positivo'),
    tipo: yup.number()
        .oneOf(tiposNumericos, 'El tipo de periodo no es válido')
        .notRequired()
        .nullable()
        .default(TipoPeriodoEnum.QUINCENA),
});

export type VerificarFirmaExistenteType = yup.InferType<typeof VerificarFirmaExistenteDto>;