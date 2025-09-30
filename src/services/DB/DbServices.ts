import { injectable } from "tsyringe";
import { WhereOptions, Op } from "sequelize";
import { sequelizeInit } from "../../config/database";
import { ConnectionName } from "../../config/configDatabase";

@injectable()
export default class DbServices {

    constructor() {}

    rawCast(
        connection:ConnectionName,
        campo: string,
        tipo: string,
        valor: any,
        operador: symbol = Op.eq
    ) : WhereOptions 
    {
        const sequelizeInstancia = sequelizeInit(connection)
        return sequelizeInstancia.where(
            sequelizeInstancia.cast(sequelizeInstancia.col(campo), tipo),
            { [operador]: sequelizeInstancia.cast(valor, tipo) }
        )
    }

}