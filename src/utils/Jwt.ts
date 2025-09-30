import jwt from "jsonwebtoken";

const KEY = process.env.JWT_SECRET || 'key1Secret'
const EXPIRE = '72h'

export function generateToken(payload:object) : string {
    return jwt.sign(payload, KEY, { expiresIn: EXPIRE })
} 

export function verifyToken(token:string) : any {
    try { return jwt.verify(token, KEY) } catch (error) { return null }
}