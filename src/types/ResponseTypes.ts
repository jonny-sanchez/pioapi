import { Request } from 'express'

export type userToken = {
    id_users?: string | number;
    codigo_user?: string | null;
    id_rol?: number;
    first_name?: string;
    second_name?: string;
    first_last_name?: string;
    second_last_name?: string;
    email?: string | null | undefined;
    dpi?: string | null;
    fecha_nacimiento?: Date | null;
    direccion?: string | null;
    puesto_trabajo?: string | null;
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

export interface RequestAuth<T = any> extends Request{
    user?: userToken | null | undefined;
    body: T
}