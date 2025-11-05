import { Sequelize } from "sequelize";
import { configDatabase, DEFAULT_CONNECTION, ConnectionName } from "./configDatabase";

const connections: { [key in ConnectionName]?: Sequelize } = {};

export function sequelizeInit(instancia:ConnectionName = DEFAULT_CONNECTION) {

  if (connections[instancia]) {
    // Reusar instancia si ya existe
    return connections[instancia]!;
  }

  const dbConfig = configDatabase[instancia]

  const sequalize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig.options
  )

  // Cachear la instancia
  connections[instancia] = sequalize;

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

