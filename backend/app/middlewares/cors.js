const allowedOrigins = ['https://peluqueria-invasion.vercel.app', 'http://localhost:5173'];

export const corsOptions = {
  origin: function (origin, callback) {
    // Verificamos si el origen de la petición que llega está en la lista de orígenes permitidos
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permitir el envío de cookies y credenciales
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept'
  ], // Encabezados permitidos
  exposedHeaders: ['Set-Cookie'], // Permitir que el cliente acceda a las cookies
};
