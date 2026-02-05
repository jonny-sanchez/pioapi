import { createClient } from 'redis'

const redisClient = createClient({
    url: `${process?.env?.REDIS_URL||""}`
})

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
})

export const connectRedis = async() => {
    if(redisClient.isOpen) return
    await redisClient.connect()
    console.log(`Redis connected`)
}

export default redisClient