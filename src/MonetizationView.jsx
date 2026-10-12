import React, { useState, useEffect } from 'react';

export default function MonetizationView({ onUnlock }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseKey, setLicenseKey] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('fenix_user_session');
    if (savedUser) {
      onUnlock();
    }
  }, [onUnlock]);

  const handleAuth = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Por favor, preencha o e-mail e a senha.');
      return;
    }

    const userData = { email, token: 'usr_' + Date.now() };
    
    if (isLogin) {
      localStorage.setItem('fenix_user_session', JSON.stringify(userData));
      alert('Login efetuado com sucesso!');
      onUnlock();
    } else {
      if (!licenseKey) {
        alert('Para cadastrar uma nova conta, insira a Chave de Licença recebida após o pagamento Pix.');
        return;
      }
      localStorage.setItem('fenix_user_session', JSON.stringify(userData));
      localStorage.setItem('fenix_license', licenseKey);
      alert('Conta criada e licença ativada com sucesso!');
      onUnlock();
    }
  };

  const MERCADO_PAGO_PAYMENT_URL = "https://www.mercadopago.com.br";

  return (
    <div style={{
      minHeight: '100vh',
      background: '#020617',
      color: '#f8fafc',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        background: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#38bdf8', margin: '0 0 8px 0' }}>
            🔥 Fênix Enterprise
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
            {isLogin ? 'Aceda à sua conta para gerir o ecossistema.' : 'Crie a sua conta e ative a sua licença.'}
          </p>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #334155', marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '10px',
              background: 'none',
              border: 'none',
              borderBottom: isLogin ? '2px solid #38bdf8' : 'none',
              color: isLogin ? '#38bdf8' : '#94a3b8',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Entrar
          </button>
          <button 
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '10px',
              background: 'none',
              border: 'none',
              borderBottom: !isLogin ? '2px solid #38bdf8' : 'none',
              color: !isLogin ? '#38bdf8' : '#94a3b8',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Criar Conta / Ativar
          </button>
        </div>

        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#020617',
                border: '1px solid #334155',
                borderRadius: '10px',
                color: '#fff',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#020617',
                border: '1px solid #334155',
                borderRadius: '10px',
                color: '#fff',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#38bdf8', display: 'block', marginBottom: '5px' }}>Chave de Licença Pix</label>
              <input 
                type="text" 
                placeholder="Ex: FENIX-PRO-2026" 
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#020617',
                  border: '1px solid #38bdf8',
                  borderRadius: '10px',
                  color: '#fff',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <button 
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              color: '#ffffff',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            {isLogin ? 'Entrar no Aplicativo' : 'Criar Conta e Entrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #1e293b' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>Ainda não tem licença?</p>
          <a 
            href={MERCADO_PAGO_PAYMENT_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '10px',
              background: '#020617',
              border: '1px solid #22c55e',
              borderRadius: '10px',
              color: '#22c55e',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 'bold'
            }}
          >
            ⚡ Comprar Licença via Pix / Mercado Pago
          </a>
        </div>
      </div>
    </div>
  );
}
