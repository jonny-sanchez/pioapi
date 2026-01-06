import { container } from "tsyringe";
import AuthJob from "./Auth/AuthJob";
import IJob from "../interface/Jobs/IJob";

export default class ServerJob {

    constructor() {}

    static JobModule() {
        return [
            AuthJob
        ]
    }

    static handle() {
        for(const Job of this.JobModule()){
            const instance = container.resolve<IJob>(Job)
            instance.start()
        }
    }

}