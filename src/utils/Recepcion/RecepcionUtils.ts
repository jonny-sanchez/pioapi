import ResponseEntryArticulosSapType from "../../types/Recepciones/ResponseEntryArticulosSapType"

export const SERIES_AVICOLA:string[] = ["AG2", "AG3", "AGPE"]

export const SERIES_INSUMOS:string[] = ["INS", "PEI"]

export const validResponseSapRecepcion = (responseSapSdk:ResponseEntryArticulosSapType) => {
    const { llave, llave2, resultado } = responseSapSdk
    if(!llave || !llave2 || !resultado) throw new Error("Ocurrio un error al realizar la entrada de inventario a SAP porfavor intente de nuevo.")
}