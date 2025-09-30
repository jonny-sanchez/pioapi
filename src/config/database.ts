import { Sequelize } from "sequelize";
import { configDatabase, DEFAULT_CONNECTION, ConnectionName } from "./configDatabase";

export function sequelizeInit(instancia:ConnectionName = DEFAULT_CONNECTION) {

  const dbConfig = configDatabase[instancia]

  const sequalize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig.options
  )

  return sequalize

}

export const connectionDb = async() =>
{
  try {

    Object.entries(configDatabase).forEach(async([ key, value ]) => {
      const sequelize = sequelizeInit(key as ConnectionName)
      await sequelize.authenticate()
      console.log(`Test conexion db ${ value.database } exitoso`)
    })
    
  } catch (error) {

    console.log(`Error al realizar la conexion a la base de datos: ${error}`)
    
  }
}

