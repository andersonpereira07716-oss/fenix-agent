import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Servir ficheiros estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// Rota de status da API
app.get('/api/status', (req, res) => {
    res.json({ status: "online", agent: "Fênix Local Hub", timestamp: new Date().toISOString() });
});

// Rota de pagamento simulada/real
app.post('/api/pagar', (req, res) => {
    res.json({ init_point: "https://mercadopago.com.br", aviso: "Modo de simulação ativo." });
});

// Iniciar o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor Fênix a rodar em http://localhost:${PORT}`);
});
