import { verifyToken } from "../../utils/Jwt";
import { injectable } from "tsyringe";
import { ValidJwtDtoType } from "../../dtos/ValidJwtDto";

@injectable()
export default class JwtService {

    constructor() {}

    async verifyJwtToken(data:ValidJwtDtoType) : Promise<any> {
        const resultValidate = await verifyToken(data.tokenText) 
        if(!resultValidate) throw new Error("Error token no valido.");
        return resultValidate
    }

}