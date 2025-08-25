import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",  // Permite conexões de todos os IPs, útil para testes em rede local
    port: 8080,  // Porta padrão do servidor de desenvolvimento
  },
  plugins: [
    react(), // Usando o plugin react com SWC (fast alternative to Babel)
    mode === 'development' && componentTagger(), // Usando o componente Tagger no modo desenvolvimento
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias para a pasta src
    },
  },
  build: {
    outDir: 'dist', // Diretório de saída da build
    chunkSizeWarningLimit: 2500, // Limite do tamanho dos chunks para evitar warnings
  },
}));
