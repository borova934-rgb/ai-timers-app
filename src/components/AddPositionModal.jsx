import React, { useState } from 'react';
import { X } from 'lucide-react';
import IOSDateSelect from './IOSDateSelect';

const AddPositionModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  
  // Default string for date select to initialize
  const defaultDateStr = "";

  const [geminiPro, setGeminiPro] = useState(defaultDateStr);
  const [geminiFlash, setGeminiFlash] = useState(defaultDateStr);
  const [claude, setClaude] = useState(defaultDateStr);
  const [claudeAnthropic, setClaudeAnthropic] = useState(defaultDateStr);
  const [claudeAnthropicEnabled, setClaudeAnthropicEnabled] = useState(false);
  const [claudeAnthropicBadge, setClaudeAnthropicBadge] = useState('Pro');
  const [country, setCountry] = useState('');
  const [accountType, setAccountType] = useState('Free');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onSave({
      id: Date.now().toString(),
      name,
      geminiPro,
      geminiFlash,
      claude,
      claudeAnthropic,
      claudeAnthropicEnabled,
      claudeAnthropicBadge,
      country,
      accountType,
      overrides: { geminiPro: null, geminiFlash: null, claude: null, claudeAnthropic: null }
    });
  };

  const handleGeminiProChange = (val) => {
    setGeminiPro(val);
    
    // Auto-fill feature: if flash and claude are untouched (equal to default), we duplicate it.
    if (geminiFlash === defaultDateStr) setGeminiFlash(val);
    if (claude === defaultDateStr) setClaude(val);
    if (claudeAnthropic === defaultDateStr) setClaudeAnthropic(val);
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
            Gemini 3.1 Pro
          </label>
          <IOSDateSelect value={geminiPro} onChange={handleGeminiProChange} />

          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>
            Gemini 3 Flash
          </label>
          <IOSDateSelect value={geminiFlash} onChange={setGeminiFlash} />

          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>
            Claude 4.6 Opus/Sonnet
          </label>
          <IOSDateSelect value={claude} onChange={setClaude} />

          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', fontSize: '15px', color: 'var(--text-main)', cursor: 'pointer', marginTop: '16px' }}>
            <input 
              type="checkbox" 
              checked={claudeAnthropicEnabled} 
              onChange={e => setClaudeAnthropicEnabled(e.target.checked)} 
              style={{ marginRight: '10px', width: '20px', height: '20px', accentColor: 'var(--accent)' }}
            />
            Показывать таймер Claude Anthropic на главной
          </label>

          {claudeAnthropicEnabled && (
            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>
                Окончание таймера Claude Anthropic
              </label>
              <IOSDateSelect value={claudeAnthropic} onChange={setClaudeAnthropic} />
              
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>Значок на главном экране (например: "Pro")</label>
              <input 
                type="text" 
                value={claudeAnthropicBadge} 
                onChange={e => setClaudeAnthropicBadge(e.target.value)}
                placeholder="Pro"
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px', 
                  border: '1px solid var(--separator)', backgroundColor: 'var(--bg-color)',
                  color: 'var(--text-main)', marginBottom: 0, fontSize: '16px', outline: 'none'
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>
                Страна (опц.)
              </label>
              <input 
                type="text" 
                value={country} 
                onChange={e => setCountry(e.target.value)} 
                placeholder="USA"
                style={{...inputStyle, marginBottom: 0, fontFamily: 'inherit'}}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>
                Тип аккаунта
              </label>
              <select 
                value={accountType} 
                onChange={e => setAccountType(e.target.value)}
                style={{...inputStyle, marginBottom: 0, fontFamily: 'inherit', WebkitAppearance: 'none'}}
              >
                <option value="Free">Free</option>
                <option value="Pro">Pro</option>
                <option value="Ultra">Ultra</option>
              </select>
            </div>
          </div>

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
