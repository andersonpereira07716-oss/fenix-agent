import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/status', (req, res) => {
    res.json({ status: "online", agent: "Fênix Enterprise v6", timestamp: new Date().toISOString() });
});

// Endpoint para simular ou ler processos do PM2 local no Termux
app.get('/api/pm2/status', (req, res) => {
    exec('pm2 jlist', (error, stdout) => {
        if (error) {
            return res.json({ processes: [{ name: 'fenix-node-local', status: 'online', memory: '45MB', cpu: '0%' }] });
        }
        try {
            const list = JSON.parse(stdout);
            const procs = list.map(p => ({
                name: p.name,
                status: p.pm2_env.status,
                memory: Math.round(p.monit.memory / 1024 / 1024) + 'MB',
                cpu: p.monit.cpu + '%'
            }));
            res.json({ processes: procs });
        } catch (e) {
            res.json({ processes: [{ name: 'fenix-core', status: 'online', memory: '40MB', cpu: '0%' }] });
        }
    });
});

// Endpoint de IA para otimizar textos ou gerar ideias KDP
app.post('/api/ia/processar', async (req, res) => {
    const { prompt, acao } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    try {
        if (!apiKey) {
            // Resposta inteligente simulada caso a chave não esteja definida na Vercel
            let respostaSimulada = `[Modo IA Simulado] Ideia estruturada para: "${prompt}". Sugestão de foco: Crie títulos magnéticos, valide o nicho com palavras-chave de alta busca na Amazon e mantenha uma introdução forte.`;
            if (acao === 'marketing') respostaSimulada = `[Estratégia de Vendas] 1. Crie escassez com bónus exclusivos. 2. Use gatilhos de transformação rápida. 3. Direcione o tráfego via WhatsApp e anúncios segmentados.`;
            return res.json({ resultado: respostaSimulada });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Atue como um especialista em infoprodutos e KDP. Responda de forma direta e comercial ao pedido: ${prompt}` }] }]
            })
        });

        const data = await response.json();
        const textoGerado = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao gerar resposta da IA.";
        res.json({ resultado: textoGerado });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/vendas/stats', async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ vendasHoje: 4, faturamentoTotal: 196.00 });
        }
        const { data, error } = await supabase.from('vendas').select('*').order('created_at', { ascending: false });
        if (error) return res.json({ vendasHoje: 0, faturamentoTotal: 0.0 });

        let vendasHoje = 0;
        let faturamentoTotal = 0.0;
        const hojeStr = new Date().toISOString().split('T')[0];

        data.forEach(v => {
            const valor = parseFloat(v.valor || 49.0);
            faturamentoTotal += valor;
            if ((v.created_at || '').split('T')[0] === hojeStr) vendasHoje += 1;
        });

        res.json({ vendasHoje, faturamentoTotal });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/pagar', async (req, res) => {
    const { titulo, preco } = req.body;
    const mpAccessToken = process.env.MP_ACCESS_TOKEN;
    try {
        if (!mpAccessToken) {
            return res.json({ init_point: "https://mercadopago.com.br", aviso: "Modo simulação ativo." });
        }
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${mpAccessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: [{ title: titulo || "E-book KDP Avançado", quantity: 1, unit_price: parseFloat(preco || 49.00) }],
                back_urls: { success: "https://fenix-agent.vercel.app", failure: "https://fenix-agent.vercel.app", pending: "https://fenix-agent.vercel.app" },
                auto_return: "approved"
            })
        });
        const data = await response.json();
        res.json({ init_point: data.init_point || data.sandbox_init_point });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default app;
