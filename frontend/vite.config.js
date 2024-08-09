export default {
    server: {
      proxy: {
        '/api': 'http://localhost:3001', // O la URL de tu backend desplegado
      },
    },
};