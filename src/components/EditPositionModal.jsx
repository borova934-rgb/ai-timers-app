import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { calculateTimeRemaining } from '../utils';
import IOSDateSelect from './IOSDateSelect';

const EditPositionModal = ({ position, onClose, onUpdate }) => {
  const [name, setName] = useState(position.name);
  const [geminiPro, setGeminiPro] = useState(position.geminiPro);
  const [geminiFlash, setGeminiFlash] = useState(position.geminiFlash);
  const [claude, setClaude] = useState(position.claude);
  const [claudeEnabled, setClaudeEnabled] = useState(position.claudeEnabled !== false);
  const [country, setCountry] = useState(position.country || '');
  const [accountType, setAccountType] = useState(position.accountType || 'Free');

  const geminiProTimer = calculateTimeRemaining(geminiPro, position.overrides?.geminiPro);
  const geminiFlashTimer = calculateTimeRemaining(geminiFlash, position.overrides?.geminiFlash);
  const claudeTimer = calculateTimeRemaining(claude, position.overrides?.claude);

  const handleOverride = (field, delta) => {
    const current = position.overrides?.[field] !== null && position.overrides?.[field] !== undefined 
      ? position.overrides[field] 
      : 100;
      
    let next = current + delta;
    if (next < 20) next = 20;
    if (next > 100) next = 100;

    onUpdate(position.id, {
      ...position,
      overrides: {
        ...position.overrides,
        [field]: next
      }
    });
  };

  const saveDatesAndClose = () => {
    onUpdate(position.id, {
      ...position,
      name,
      geminiPro,
      geminiFlash,
      claude,
      claudeEnabled,
      country,
      accountType
    });
    onClose();
  };

  const renderControl = (label, field, timer, dateVal, setDateVal) => {
    const currentOverride = position.overrides?.[field] !== null && position.overrides?.[field] !== undefined 
      ? position.overrides[field] 
      : 100;

    return (
      <div style={{ marginBottom: '24px', background: 'var(--panel-bg)', padding: '16px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <button 
            onClick={() => setDateVal('')} 
            style={{ padding: '6px 12px', fontSize: '12px', background: 'var(--color-danger)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Обнулить таймер
          </button>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--text-dim)' }}>Целевая дата (Формат США):</p>
          <IOSDateSelect value={dateVal} onChange={setDateVal} />
        </div>

        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--text-dim)' }}>Заполнение прогресс-бара:</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', background: 'var(--bg-color)', borderRadius: '8px', opacity: timer.isZero ? 1 : 0.5 }}>
          <button onClick={() => timer.isZero && handleOverride(field, -20)} style={{ padding: '8px', background: 'var(--panel-bg)', borderRadius: '8px', cursor: timer.isZero ? 'pointer' : 'not-allowed', border: 'none' }}>
            <Minus size={20} color="var(--accent)" />
          </button>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentOverride}%</span>
          <button onClick={() => timer.isZero && handleOverride(field, 20)} style={{ padding: '8px', background: 'var(--panel-bg)', borderRadius: '8px', cursor: timer.isZero ? 'pointer' : 'not-allowed', border: 'none' }}>
            <Plus size={20} color="var(--accent)" />
          </button>
        </div>
        {!timer.isZero && <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--color-danger)' }}>Недоступно: таймер еще работает</p>}
      </div>
    );
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
        maxWidth: '450px',
        padding: '24px',
        background: 'var(--panel-bg)',
        borderRadius: '24px',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', padding: '8px', cursor: 'pointer',
          background: 'none', border: 'none'
        }}>
          <X size={24} color="var(--text-dim)" />
        </button>
        
        <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Настройки</h2>
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>Имя аккаунта</label>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)}
          style={{
            width: '100%', padding: '12px', borderRadius: '10px', 
            border: '1px solid var(--separator)', backgroundColor: 'var(--bg-color)',
            color: 'var(--text-main)', marginBottom: '24px', fontSize: '16px', outline: 'none'
          }}
        />

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>Страна (опц.)</label>
            <input 
              type="text" 
              value={country} 
              onChange={e => setCountry(e.target.value)}
              placeholder="USA"
              style={{
                width: '100%', padding: '12px', borderRadius: '10px', 
                border: '1px solid var(--separator)', backgroundColor: 'var(--bg-color)',
                color: 'var(--text-main)', marginBottom: 0, fontSize: '16px', outline: 'none'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>Тип аккаунта</label>
            <select 
              value={accountType} 
              onChange={e => setAccountType(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px', 
                border: '1px solid var(--separator)', backgroundColor: 'var(--bg-color)',
                color: 'var(--text-main)', marginBottom: 0, fontSize: '16px', outline: 'none', WebkitAppearance: 'none'
              }}
            >
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Ultra">Ultra</option>
            </select>
          </div>
        </div>

        {renderControl('Gemini Pro', 'geminiPro', geminiProTimer, geminiPro, setGeminiPro)}
        {renderControl('Gemini Flash', 'geminiFlash', geminiFlashTimer, geminiFlash, setGeminiFlash)}
        
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', fontSize: '15px', color: 'var(--text-main)', cursor: 'pointer', background: 'var(--panel-bg)', padding: '16px', borderRadius: '12px' }}>
          <input 
            type="checkbox" 
            checked={claudeEnabled} 
            onChange={e => setClaudeEnabled(e.target.checked)} 
            style={{ marginRight: '10px', width: '20px', height: '20px', accentColor: 'var(--accent)' }}
          />
          Показывать таймер Claude Anthropic
        </label>

        {claudeEnabled && renderControl('Claude', 'claude', claudeTimer, claude, setClaude)}

        <button 
          onClick={saveDatesAndClose}
          style={{
            width: '100%', padding: '16px', backgroundColor: 'var(--accent)', color: '#fff',
            borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', marginTop: '8px',
            cursor: 'pointer', border: 'none'
          }}
        >
          Сохранить изменения
        </button>
      </div>
    </div>
  );
};

export default EditPositionModal;
