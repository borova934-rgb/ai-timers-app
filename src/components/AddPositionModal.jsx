import React, { useState } from 'react';
import { X } from 'lucide-react';
import IOSDateSelect from './IOSDateSelect';

const AddPositionModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  
  // Default string for date select to initialize
  const defaultDateStr = "04/06/2026 04:02:01 PM";

  const [geminiPro, setGeminiPro] = useState(defaultDateStr);
  const [geminiFlash, setGeminiFlash] = useState(defaultDateStr);
  const [claude, setClaude] = useState(defaultDateStr);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onSave({
      id: Date.now().toString(),
      name,
      geminiPro,
      geminiFlash,
      claude,
      overrides: { geminiPro: null, geminiFlash: null, claude: null }
    });
  };

  const handleGeminiProChange = (val) => {
    setGeminiPro(val);
    
    // Auto-fill feature: if flash and claude are untouched (equal to default), we duplicate it.
    if (geminiFlash === defaultDateStr) setGeminiFlash(val);
    if (claude === defaultDateStr) setClaude(val);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid var(--separator)',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-main)',
    marginBottom: '16px',
    fontSize: '16px',
    outline: 'none',
    fontFamily: 'monospace'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="ios-card" style={{
        width: '90%',
        maxWidth: '400px',
        padding: '24px',
        background: 'var(--panel-bg)',
        borderRadius: '24px',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', padding: '8px'
        }}>
          <X size={24} color="var(--text-dim)" />
        </button>
        
        <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Добавить аккаунт</h2>
        
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>
            Имя аккаунта
          </label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="например, name@gmail.com"
            style={{...inputStyle, fontFamily: 'inherit'}}
            required
          />

          <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '12px', lineHeight: '1.4' }}>
            Формат времени США, штат Флорида:
          </p>

          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>
            Gemini Pro
          </label>
          <IOSDateSelect value={geminiPro} onChange={handleGeminiProChange} />

          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>
            Gemini Flash
          </label>
          <IOSDateSelect value={geminiFlash} onChange={setGeminiFlash} />

          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>
            Claude
          </label>
          <IOSDateSelect value={claude} onChange={setClaude} />

          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'var(--accent)',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '8px'
            }}
          >
            Добавить аккаунт
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPositionModal;
