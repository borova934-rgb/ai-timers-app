import React, { useState, useEffect } from 'react';
import { calculateTimeRemaining } from '../utils';
import ProgressBar from './ProgressBar';
import { Trash2 } from 'lucide-react';

const PositionCard = ({ position, index, onOverrideClick, onDelete }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const geminiProTimer = calculateTimeRemaining(position.geminiPro, position.overrides?.geminiPro);
  const geminiFlashTimer = calculateTimeRemaining(position.geminiFlash, position.overrides?.geminiFlash);
  const claudeTimer = calculateTimeRemaining(position.claude, position.overrides?.claude);

  return (
    <div 
      className="ios-card ios-glass"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '14px 16px',
        marginBottom: '12px',
        cursor: 'pointer',
        borderRadius: '20px'
      }}
      onClick={() => onOverrideClick(position)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', maxWidth: '80%' }}>
          <span style={{ 
            background: 'var(--accent)', color: '#fff', width: '22px', height: '22px', 
            borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '11px', fontWeight: 'bold', flexShrink: 0
          }}>{index + 1}</span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{position.name}</span>
          
          {position.country && (
            <span style={{ 
              fontSize: '11px', padding: '2px 6px', borderRadius: '6px', 
              background: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)', fontWeight: 'bold', flexShrink: 0 
            }}>{position.country}</span>
          )}
          {position.accountType && (
            <span style={{ 
              fontSize: '11px', padding: '2px 6px', borderRadius: '6px', 
              background: 'var(--accent)', color: '#fff', fontWeight: 'bold', flexShrink: 0 
            }}>{position.accountType}</span>
          )}
        </h3>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(position.id); }} 
          style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7 }}
        >
          <Trash2 size={20} color="var(--color-danger)" />
        </button>
      </div>
      
      <div>
        <ProgressBar name="Gemini Pro" data={geminiProTimer} />
        <ProgressBar name="Gemini Flash" data={geminiFlashTimer} />
        {position.claudeEnabled !== false && (
          <ProgressBar name="Claude" data={claudeTimer} />
        )}
      </div>
    </div>
  );
};

export default PositionCard;
