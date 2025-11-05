import { Transaction } from "sequelize";
import { ConnectionName, DEFAULT_CONNECTION } from "../../config/configDatabase";
import { sequelizeInit } from "../../config/database";

export async function handleTransaction (
    callback: (t?: Transaction)=>Promise<any> = async() => { },
    connection:ConnectionName = DEFAULT_CONNECTION,
) 
{

    let t:Transaction = await sequelizeInit(connection).transaction()

    try {

        const result = await callback(t)
        
        await t.commit()

        return result

    } catch (error) {

        await t.rollback()

        throw error

    }

}