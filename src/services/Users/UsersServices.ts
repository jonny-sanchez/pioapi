import UsersRepository from "../../repositories/UsersRepository";
import { injectable, inject } from "tsyringe";

@injectable()
export default class UsersServices {

    constructor(@inject(UsersRepository) private usersRepository:UsersRepository) {}

}