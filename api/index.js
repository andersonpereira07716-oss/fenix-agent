import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/status', (req, res) => {
    res.json({ status: "online", agent: "Fênix Enterprise", timestamp: new Date().toISOString() });
});

app.get('/api/vendas/stats', async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ vendasHoje: 4, faturamentoTotal: 196.00, aviso: "Supabase não configurado (modo simulação)." });
        }

        const { data, error } = await supabase.from('vendas').select('*').order('created_at', { ascending: false });
        if (error) {
            return res.json({ vendasHoje: 0, faturamentoTotal: 0.0, aviso: "Tabela vendas não encontrada no Supabase." });
        }

        let vendasHoje = 0;
        let faturamentoTotal = 0.0;
        const hojeStr = new Date().toISOString().split('T')[0];

        data.forEach(v => {
            const valor = parseFloat(v.valor || 49.0);
            faturamentoTotal += valor;
            if ((v.created_at || '').split('T')[0] === hojeStr) vendasHoje += 1;
        });

        res.json({ vendasHoje, faturamentoTotal, leads: data.slice(0, 5) });
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
            headers: {
                'Authorization': `Bearer ${mpAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: [{ title: titulo || "E-book KDP", quantity: 1, unit_price: parseFloat(preco || 49.00) }],
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
