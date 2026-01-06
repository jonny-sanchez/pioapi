import { inject, injectable } from "tsyringe";
import DetalleEmpleadoCootraguaViewRepository from "../../repositories/DetalleEmpleadoCootraguaViewRepository";
import UsersRepository from "../../repositories/UsersRepository";
import CronJobLogRepository from "../../repositories/CronJobLogRepository";
import { handleTransaction } from "../../utils/DB/TransactionsHelpers";

@injectable()
export default class AuthJobService {

    constructor(
        @inject(DetalleEmpleadoCootraguaViewRepository) private detalleEmpleadoCootraguaViewRepository:DetalleEmpleadoCootraguaViewRepository,
        @inject(UsersRepository) private usersRepository:UsersRepository,
        @inject(CronJobLogRepository) private cronJobLogRepository:CronJobLogRepository
    ) {}

    async actionSetLowAssociatesAll() : Promise<any> {
        let success:boolean = false
        let users_updated:number = 0
        let message:string = ""
        let error:any = null
        let users_low:number[] = []
        try {

            await handleTransaction(async (t) => {
                //primero esxtraer de "PIOAPP" solo usarios activos "baja = false"
                const users = await this.usersRepository.getUserActive(true)
                //segundo extrear los usarios de "PIOAPP" exter los que estan de baja en "NOMINA"
                const empleadosNomina = await this.detalleEmpleadoCootraguaViewRepository.findEmpleadoLowByUsersModel(users, true)
                //tercero editar el campo baja del usuario que trajo de nomina a "baja = true"
                users_updated = await this.usersRepository.lowUsersUpdate({ baja: true }, empleadosNomina, t)
                users_low = empleadosNomina.flatMap(({ codEmpleado }) => codEmpleado)
                success = true
                message = `Set completado de asociados de baja... se actualizaron ${users_updated ?? 0}`
                console.log(message)
            }, "PIOAPP")

        } catch (error:any) {

            success = false
            message = `Error al completar el set de asociados de baja`
            error = error?.message || error?.stack || error
            console.log(message)

        }finally{

            await this.cronJobLogRepository.create({ 
                descripcion: message,
                tipo: "LOW_ASSOCIATE",
                intentos: 1,
                success_job: success,
                data_context: {
                    error,
                    users_low,
                    users_updated
                }
            })

        }
        
    }

}