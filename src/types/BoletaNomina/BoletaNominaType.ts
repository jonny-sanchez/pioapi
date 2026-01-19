export interface ResumenPagoResponse {
    nombrePeriodo: string | null;
    totalRecibido: number;
    numeroBoleta: number;
    periodo: string;
    diasTrabajados: number;
    descuentos: {
        igss: number;
        isr: number;
        ahorro: number;
        seguro: number;
        otrosDescuentos: number;
        totalDescuentos: number;
    };
}

export interface DetalleCompletoResponse {
    numeroBoleta: number;
    empleado: {
        codigo: string | null;
        nombre: string | null;
    };
    periodo: {
        id: number;
        nombre: string | null;
        rango: string;
        fechaInicio: string;
        fechaFin: string;
    };
    diasTrabajados: number;
    firma?: {
        idFirmaBoleta: string;
        fechaFirma: Date;
        valido: boolean;
    };
    ingresos: {
        salarioOrdinario: number;
        horasSimples: number;
        horasDobles: number;
        bonificacion: number;
        otrosIngresos: number;
        totalIngresos: number;
    };
    descuentos: {
        anticipo: number,
        igss: number;
        isr: number;
        ahorro: number;
        seguro: number;
        otrosDescuentos: number;
        totalDescuentos: number;
    };
    neto: number;
    liquido: number;
    tipo: number
}

export type VerificarBoletaResponse ={
    existe: boolean;
    pagado?: boolean;
}