import React, { useState } from 'react';

export default function MonetizationView({ onUnlock }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [licenseKey, setLicenseKey] = useState('');
  const [paymentStep, setPaymentStep] = useState('select'); // 'select', 'pix', 'license'

  const handlePixPayment = () => {
    setPaymentStep('pix');
    // Aqui podes integrar a chamada real ao Mercado Pago API ou abrir o QR Code do Pix
  };

  const handleActivateLicense = (e) => {
    e.preventDefault();
    if (licenseKey.trim().length > 5) {
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

        {paymentStep === 'select' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div 
                onClick={() => setSelectedPlan('monthly')}
                style={{
                  flex: 1,
                  padding: '15px',
                  background: selectedPlan === 'monthly' ? '#1e293b' : '#020617',
                  border: `2px solid ${selectedPlan === 'monthly' ? '#38bdf8' : '#334155'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>MENSAL</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f8fafc' }}>R$ 39,90</div>
              </div>
              <div 
                onClick={() => setSelectedPlan('annual')}
                style={{
                  flex: 1,
                  padding: '15px',
                  background: selectedPlan === 'annual' ? '#1e293b' : '#020617',
                  border: `2px solid ${selectedPlan === 'annual' ? '#38bdf8' : '#334155'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '12px', color: '#38bdf8' }}>ANUAL (PRO)</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f8fafc' }}>R$ 297,00</div>
              </div>
            </div>

            {/* Opção 1: Botão de Pagamento Pix */}
            <button 
              onClick={handlePixPayment}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                color: '#white',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '15px',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)'
              }}
            >
              ⚡ Pagar com Pix (Acesso Instantâneo)
            </button>

            <div style={{ textAlign: 'center', margin: '15px 0', color: '#64748b', fontSize: '13px' }}>
              ou se já tens um código de ativação
            </div>

            {/* Opção 2: Ativação por Chave de Licença */}
            <button 
              onClick={() => setPaymentStep('license')}
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
        )}

        {paymentStep === 'pix' && (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#f8fafc', fontSize: '16px' }}>Pagamento via Pix</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>
              Escaneia o QR Code ou copia o código Pix abaixo para liberar o teu acesso ao Fênix imediatamente:
            </p>
            <div style={{ 
              background: '#ffffff', 
              padding: '15px', 
              borderRadius: '10px', 
              margin: '15px 0',
              color: '#000',
              fontWeight: 'bold',
              wordBreak: 'break-all',
              fontSize: '11px'
            }}>
              00020126580014br.gov.bcb.pix... (Chave Dinâmica Gerada)
            </div>
            <button 
              onClick={() => alert('Assim que o pagamento for confirmado na sua conta Mercado Pago, o acesso será liberado.')}
              style={{
                width: '100%',
                background: '#22c55e',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              Já fiz o pagamento (Verificar)
            </button>
            <button 
              onClick={() => setPaymentStep('select')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
            >
              Voltar aos planos
            </button>
          </div>
        )}

        {paymentStep === 'license' && (
          <form onSubmit={handleActivateLicense}>
            <h3 style={{ color: '#f8fafc', fontSize: '16px', marginBottom: '10px' }}>Ativação por Licença</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '15px' }}>
              Insere a tua chave de acesso fornecida após a compra:
            </p>
            <input 
              type="text" 
              placeholder="Ex: FENIX-PRO-2026-XXXX" 
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
              onClick={() => setPaymentStep('select')}
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
