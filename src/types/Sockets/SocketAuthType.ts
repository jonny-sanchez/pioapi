import { Socket } from "socket.io";
import { userToken } from "../ResponseTypes";

export default interface SocketAuthType extends Socket{
    user?: userToken;
}