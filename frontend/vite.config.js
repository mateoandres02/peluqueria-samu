// import { defineConfig } from 'vite';
// import { createHtmlPlugin } from 'vite-plugin-html';

// export default defineConfig({
//   build: {
//     outDir: 'dist', // Directorio de salida
//     rollupOptions: {
//       input: {
//         main: 'index.html',
//         login: 'login.html', // Añade cualquier otro archivo HTML aquí
//       },
//     },
//   },
//   plugins: [
//     createHtmlPlugin({
//       minify: true,
//     }),
//   ]
// });

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        login: './login.html'
      }
    }
  }
})
