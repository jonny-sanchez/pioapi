import rateLimit from "express-rate-limit";

const limiterMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30,                // 30 requests
  message: {
    message: 'Demasiadas solicitudes, intenta más tarde',
    status: false,
    data: null
  },
  standardHeaders: true,  // headers RateLimit-*
  legacyHeaders: false,
})

export default limiterMiddleware