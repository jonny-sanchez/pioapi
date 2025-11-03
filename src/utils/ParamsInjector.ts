import { Request } from "express";

/**
 * Inyecta los route params y query params en el request body
 * @param req - Request object de Express
 * @example
 * // URL: /users/123/posts?status=active&limit=10
 * // req.body original: { title: "Mi post" }
 * // Después de inyección: { title: "Mi post", id: "123", status: "active", limit: "10" }
 */
export const injectParamsToBody = (req: Request): void => {
    const hasParams = req.params && Object.keys(req.params).length > 0;
    const hasQuery = req.query && Object.keys(req.query).length > 0;

    if (hasParams || hasQuery) {
        req.body = {
            ...req.body,
            ...(hasParams ? req.params : {}),
            ...(hasQuery ? req.query : {})
        };
    }
};