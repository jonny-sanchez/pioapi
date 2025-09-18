import { Request } from 'express'

export type userToken = {
    id_users?: string | number;
    id_rol?: string | number;
    first_name?: string;
    second_name?: string;
    first_last_name?: string;
    second_last_name?: string;
    email?: string | null | undefined;
    userCreatedAt?: number | null | undefined;
    userUpdatedAt?: number | null | undefined;
    createdAt?: string | null | undefined;
    updatedAt?: string | null | undefined;
}

export interface JsonResponse<T = any> {
    message?: string | null;
    status?: boolean | null;
    data?: T | null;
}

export interface RequestAuth extends Request{
    user?: userToken | null | undefined
}