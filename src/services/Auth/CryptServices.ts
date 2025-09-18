import { injectable } from "tsyringe";
import { genSalt, hash, compare } from 'bcrypt'

@injectable()
export default class CryptServices {

    private saltRounds:number

    constructor(){
        this.saltRounds = 10
    }

    async Hash(text:string = ''):Promise<String>{
        const salt = await genSalt(this.saltRounds)
        return hash(text, salt)
    }

    async Compare(text:string = '', textHash:string = ''):Promise<boolean>{
        return compare(text, textHash)
    }

}