import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { calculateTimeRemaining } from '../utils';

const OverrideControls = ({ position, onClose, onUpdate }) => {
  const geminiProTimer = calculateTimeRemaining(position.geminiPro, null);
  const geminiFlashTimer = calculateTimeRemaining(position.geminiFlash, null);
  const claudeTimer = calculateTimeRemaining(position.claude, null);

  const handleOverride = (field, delta) => {
    const current = position.overrides?.[field] !== null && position.overrides?.[field] !== undefined 
      ? position.overrides[field] 
      : 100;
      
    let next = current + delta;
    if (next < 20) next = 20;
    if (next > 100) next = 100;

    onUpdate(position.id, {
      ...position.overrides,
      [field]: next
    });
  };

  const renderControl = (name, field, timer) => {
    const isZero = timer.isZero;
    const currentOverride = position.overrides?.[field] !== null && position.overrides?.[field] !== undefined 
      ? position.overrides[field] 
      : 100;

    return (
      <div style={{ marginBottom: '24px' }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{name}</p>
        {isZero ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px' }}>
            <button onClick={() => handleOverride(field, -20)} style={{ padding: '8px', background: 'var(--panel-bg)', borderRadius: '8px' }}>
              <Minus size={20} color="var(--accent)" />
            </button>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentOverride}%</span>
            <button onClick={() => handleOverride(field, 20)} style={{ padding: '8px', background: 'var(--panel-bg)', borderRadius: '8px' }}>
              <Plus size={20} color="var(--accent)" />
            </button>
          </div>
        ) : (
          <div style={{ color: 'var(--text-dim)', fontSize: '14px', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px' }}>
            Таймер еще работает. Дождитесь 0 для ручной настройки.
          </div>
        )}
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
        maxWidth: '400px',
        padding: '24px',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', padding: '8px'
        }}>
          <X size={24} color="var(--text-dim)" />
        </button>
        
        <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Настройка процентов</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '24px', fontSize: '14px' }}>
          {position.name}
        </p>
        
        {renderControl('Gemini Pro', 'geminiPro', geminiProTimer)}
        {renderControl('Gemini Flash', 'geminiFlash', geminiFlashTimer)}
        {renderControl('Claude', 'claude', claudeTimer)}
      </div>
    </div>
  );
};

export default OverrideControls;
