import { sequelizeInit } from "../config/database"
import { ConnectionName, DEFAULT_CONNECTION } from "../config/configDatabase"
import { Response } from "express"
import { Transaction } from "sequelize"

export async function handleSend(
    res: Response,
    callback: (t?: Transaction | null | undefined)=>Promise<any> = async() => { },
    messageSuccess:string | null = '',
    isWithRollBack:boolean = false,
    connection:ConnectionName = DEFAULT_CONNECTION,
    isFile:boolean = false,
    commitController = false
){
    
    let t:Transaction | null | undefined

    if(isWithRollBack) t = await sequelizeInit(connection).transaction()

    try {

        let result:any = null

        result = await callback(t)

        if(isWithRollBack && !commitController) t && await t.commit()

        return isFile ? result : res.status(200).json({ message: messageSuccess, status: true, data: result })
  
    } catch (error:any) {

        if(isWithRollBack) t && await t.rollback()

        console.log(error)

        const message = error?.message || error?.stack;

        return res.status(500).json({ message: message ?? 'Error server internal', status: false, data: null })

    }

}