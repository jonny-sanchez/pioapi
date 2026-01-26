// PeriodoPaginacionDto
import * as yup from "yup";
import { TipoPeriodoEnum } from "../../types/PeriodosNomina/PeriodosPagadosType";

const tiposNumericos = Object.values(TipoPeriodoEnum).filter(
    (v) => typeof v === 'number'
) as number[];

export const PeriodoPaginacionDto = yup.object({
    tipo_periodo: yup.number()
        .oneOf(tiposNumericos, 'El campo [tipo_periodo] no es válido')
        .required("El campo [tipo_periodo] es obligatorio."),
    limit: yup.number().required("El campo [limit] es obligatorio."),
    cursor: yup.number().nullable().notRequired(),
    search: yup.string().nullable().notRequired()
}).required()

export type PeriodoPaginacionDtoType = yup.InferType<typeof PeriodoPaginacionDto>