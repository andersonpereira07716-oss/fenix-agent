import React, { useState } from 'react';

export default function MonetizationView({ onUnlock }) {
  const [licenseKey, setLicenseKey] = useState('');
  const [showLicenseInput, setShowLicenseInput] = useState(false);

  // Link oficial de pagamento/checkout do Mercado Pago configurado no teu ecossistema
  const MERCADO_PAGO_PAYMENT_URL = "https://www.mercadopago.com.br";

  const handleOpenPaymentLink = () => {
    window.open(MERCADO_PAGO_PAYMENT_URL, '_blank', 'noopener,noreferrer');
  };

  const handleActivateLicense = (e) => {
    e.preventDefault();
    if (licenseKey.trim().length >= 4) {
      localStorage.setItem('fenix_license', licenseKey);
      onUnlock();
    } else {
      alert('Por favor, insere uma chave de licença válida.');
    }
  };

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
        maxWidth: '450px',
        width: '100%',
        background: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#38bdf8', margin: '0 0 10px 0' }}>
            🔥 Fenix Enterprise Cloud
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
            Desbloqueie o ecossistema completo de automação e inteligência.
          </p>
        </div>

        {!showLicenseInput ? (
          <div>
            {/* Opção 1: Botão de Pagamento usando o teu link do Mercado Pago */}
            <button 
              onClick={handleOpenPaymentLink}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                color: '#ffffff',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '15px',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)'
              }}
            >
              ⚡ Pagar com Pix / Cartão (Mercado Pago)
            </button>

            <div style={{ textAlign: 'center', margin: '15px 0', color: '#64748b', fontSize: '13px' }}>
              ou se já tens a tua chave de acesso
            </div>

            {/* Opção 2: Ativação por Licença */}
            <button 
              onClick={() => setShowLicenseInput(true)}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#38bdf8',
                border: '1px solid #38bdf8',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Ativar com Chave de Licença
            </button>
          </div>
        ) : (
          <form onSubmit={handleActivateLicense}>
            <h3 style={{ color: '#f8fafc', fontSize: '16px', marginBottom: '10px' }}>Ativação por Licença</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '15px' }}>
              Insere a tua chave de acesso fornecida após o pagamento:
            </p>
            <input 
              type="text" 
              placeholder="Ex: FENIX-PRO-2026" 
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#020617',
                border: '1px solid #334155',
                borderRadius: '10px',
                color: '#fff',
                marginBottom: '15px',
                boxSizing: 'border-box'
              }}
            />
            <button 
              type="submit"
              style={{
                width: '100%',
                background: '#38bdf8',
                color: '#020617',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              Validar Licença
            </button>
            <button 
              type="button"
              onClick={() => setShowLicenseInput(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', width: '100%', textAlign: 'center' }}
            >
              Voltar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
