import { inject, injectable } from "tsyringe";
import SolicitudSupervisorTiendaRepository from "../../repositories/SolicitudSupervisorTiendaRepository";
import SolicitudEspecialInsumosRepository from "../../repositories/SolicitudEspecialInsumosRepository";
import ResponseEntryArticulosSapType from "../../types/Recepciones/ResponseEntryArticulosSapType";
import { handleTransaction } from "../../utils/DB/TransactionsHelpers";
import tEntradaInventarioModel from "../../models/pdv/tables/tEntradaInventarioModel";
import tSolicitudSupervisorTiendaModel from "../../models/pdv/tables/tSolicitudSupervisorTiendaModel";
import tSolicitudEspecialInsumosModel from "../../models/pdv/tables/tSolicitudEspecialInsumosModel";

@injectable()
export default class SolicitudInsumosService {

    constructor(
        @inject(SolicitudSupervisorTiendaRepository) private solicitudSupervisorTiendaRepository:SolicitudSupervisorTiendaRepository,
        @inject(SolicitudEspecialInsumosRepository) private solicitudEspecialInsumosRepository:SolicitudEspecialInsumosRepository 
    ) {}

    async updateInsumoPdv(entrada:tEntradaInventarioModel, responseSapSdk:ResponseEntryArticulosSapType) : Promise<number> {

        const result:number = await handleTransaction(async(t) => {
            const dataUpdate:Partial<tSolicitudSupervisorTiendaModel|tSolicitudEspecialInsumosModel> = {
                docEntryRecp: responseSapSdk.llave,
                docNumRecp: responseSapSdk.llave2,
                situacionRep: 1,
                situacion: 3 
            }

            const updateIsumosPdv = entrada.serie === 'INS' 
            ?
                this.solicitudSupervisorTiendaRepository.updateByIdSolicitud(entrada.numero, dataUpdate as tSolicitudSupervisorTiendaModel, true, t)  
            :
                this.solicitudEspecialInsumosRepository.updateByIdSolicitud(entrada.numero, dataUpdate as tSolicitudEspecialInsumosModel, true, t)

            return updateIsumosPdv
        }, 'PDV')

        return result

    }

}