import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { calculateTimeRemaining } from '../utils';
import IOSDateSelect from './IOSDateSelect';
import IOSRefreshPicker from './IOSRefreshPicker';

const EditPositionModal = ({ position, onClose, onUpdate }) => {
  const [name, setName] = useState(position.name);
  const [antigravityName, setAntigravityName] = useState(position.antigravityName || '');
  const [geminiPro, setGeminiPro] = useState(position.geminiPro);
  const [geminiFlash, setGeminiFlash] = useState(position.geminiFlash);
  const [claude, setClaude] = useState(position.claude);
  const [claudeAnthropic, setClaudeAnthropic] = useState(position.claudeAnthropic || '');
  const [claudeAnthropicEnabled, setClaudeAnthropicEnabled] = useState(position.claudeAnthropicEnabled || false);
  const [claudeAnthropicBadge, setClaudeAnthropicBadge] = useState(position.claudeAnthropicBadge || 'Pro');
  const [country, setCountry] = useState(position.country || '');
  const [accountType, setAccountType] = useState(position.accountType || 'Free');

  const [refreshTimers, setRefreshTimers] = useState(position.refreshTimers || {
    geminiPro: {days: '0', hours: '0', targetTimestamp: null },
    geminiFlash: {days: '0', hours: '0', targetTimestamp: null },
    claude: {days: '0', hours: '0', targetTimestamp: null },
    claudeAnthropic: {days: '0', hours: '0', targetTimestamp: null }
  });

  const geminiProTimer = calculateTimeRemaining(geminiPro, position.overrides?.geminiPro);
  const geminiFlashTimer = calculateTimeRemaining(geminiFlash, position.overrides?.geminiFlash);
  const claudeTimer = calculateTimeRemaining(claude, position.overrides?.claude);
  const claudeAnthropicTimer = calculateTimeRemaining(claudeAnthropic, position.overrides?.claudeAnthropic);

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

  const updateRefresh = (field, key, value) => {
    setRefreshTimers(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] || {}),
        [key]: value
      }
    }));
  };

  const saveDatesAndClose = () => {
    const updatedRefreshTimers = { ...refreshTimers };
    
    // Compute target if the duration changed
    ['geminiPro', 'geminiFlash', 'claude', 'claudeAnthropic'].forEach(field => {
       const rt = updatedRefreshTimers[field];
       if (!rt) return;
       const d = parseInt(rt.days, 10) || 0;
       const h = parseInt(rt.hours, 10) || 0;
       const oldRt = position.refreshTimers?.[field];
       
       if (d === 0 && h === 0) {
          rt.targetTimestamp = null;
       } else {
          const oldD = oldRt ? (parseInt(oldRt.days, 10) || 0) : 0;
          const oldH = oldRt ? (parseInt(oldRt.hours, 10) || 0) : 0;
          if (d !== oldD || h !== oldH || !rt.targetTimestamp) {
             const durationMs = (d * 24 * 60 * 60 * 1000) + (h * 60 * 60 * 1000);
             rt.targetTimestamp = Date.now() + durationMs;
          }
       }
    });

    onUpdate(position.id, {
      ...position,
      name,
      antigravityName,
      geminiPro,
      geminiFlash,
      claude,
      claudeAnthropic,
      claudeAnthropicEnabled,
      claudeAnthropicBadge,
      country,
      accountType,
      refreshTimers: updatedRefreshTimers
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
        
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--separator)', opacity: timer.isZero ? 1 : 0.5 }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--text-dim)', fontWeight: 'bold' }}>Авто-сброс лимитов:</p>
          <IOSRefreshPicker 
            days={refreshTimers[field]?.days || 0}
            hours={refreshTimers[field]?.hours || 0}
            disabled={!timer.isZero}
            onChange={(d, h) => {
               updateRefresh(field, 'days', d);
               updateRefresh(field, 'hours', h);
            }}
          />
        </div>
        
        {!timer.isZero && <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: 'var(--color-danger)', textAlign: 'center' }}>Недоступно: основной таймер еще работает</p>}
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
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>Имя аккаунта (основное)</label>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)}
          style={{
            width: '100%', padding: '12px', borderRadius: '10px', 
            border: '1px solid var(--separator)', backgroundColor: 'var(--bg-color)',
            color: 'var(--text-main)', marginBottom: '16px', fontSize: '16px', outline: 'none'
          }}
        />

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>Имя в Antigravity</label>
        <input 
          type="text" 
          value={antigravityName} 
          onChange={e => setAntigravityName(e.target.value)}
          placeholder="Псевдоним (опц.)"
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
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>Тип</label>
            <div style={{ display: 'flex', background: 'var(--bg-color)', borderRadius: '10px', padding: '4px', border: '1px solid var(--separator)' }}>
                {['Free', 'Pro', 'Ultra'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAccountType(type)}
                    style={{
                      flex: 1, padding: '6px', border: 'none', background: accountType === type ? 'var(--accent)' : 'transparent',
                      color: accountType === type ? '#fff' : 'var(--text-main)', borderRadius: '6px', fontWeight: accountType === type ? 'bold' : 'normal',
                      transition: 'all 0.2s', fontSize: '13px'
                    }}
                  >
                    {type}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {renderControl('Gemini 3.1 Pro', 'geminiPro', geminiProTimer, geminiPro, setGeminiPro)}
        {renderControl('Gemini 3 Flash', 'geminiFlash', geminiFlashTimer, geminiFlash, setGeminiFlash)}
        {renderControl('Claude 4.6 Opus/Sonnet', 'claude', claudeTimer, claude, setClaude)}
        
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', fontSize: '15px', color: 'var(--text-main)', cursor: 'pointer', background: 'var(--panel-bg)', padding: '16px', borderRadius: '12px' }}>
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
            {renderControl('Claude Anthropic', 'claudeAnthropic', claudeAnthropicTimer, claudeAnthropic, setClaudeAnthropic)}
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-dim)' }}>Тип аккаунта Claude Anthropic</label>
            <div style={{ display: 'flex', background: 'var(--bg-color)', borderRadius: '10px', padding: '4px', border: '1px solid var(--separator)' }}>
              {['Free', 'Pro', 'Max'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setClaudeAnthropicBadge(type)}
                  style={{
                    flex: 1, padding: '6px', border: 'none', background: claudeAnthropicBadge === type ? 'var(--accent)' : 'transparent',
                    color: claudeAnthropicBadge === type ? '#fff' : 'var(--text-main)', borderRadius: '6px', fontWeight: claudeAnthropicBadge === type ? 'bold' : 'normal',
                    transition: 'all 0.2s', fontSize: '14px'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

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
