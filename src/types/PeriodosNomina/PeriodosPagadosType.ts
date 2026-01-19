export interface PeriodosPagadosType {
    idPeriodo: number,
    nombrePeriodo: string | null,
    fechaInicio: string,
    fechaFin: string,
    pagada: boolean,
    noQuincena: number | null,
    activo: boolean,
    tipo: number
}

export enum TipoPeriodoEnum {
    QUINCENA = 1,
    AGUINALDO = 2,
    BONO14 = 3,
    VACACION = 4
}