import React from 'react';

const ProgressBar = ({ name, data }) => {
  const { passedPercentage, isZero, days, hours, minutes } = data;

  // The hue transitions from Orange `hsl(39, 100%, 50%)` to Green `hsl(120, 100%, 50%)`
  const hue = 39 + ((passedPercentage / 100) * (120 - 39));
  const fillColor = `hsl(${hue}, 100%, 45%)`; // slightly darker baseline

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
        <span>{name}</span>
        <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
          {isZero && passedPercentage === 100 
            ? '0д 0ч 0м (МСК)' 
            : isZero ? 'Завершено' : `${days}д ${hours}ч ${minutes}м (МСК)`}
        </span>
      </div>
      <div style={{ 
        height: '16px', 
        width: '100%', 
        backgroundColor: isZero ? 'rgba(255, 255, 255, 0.05)' : 'var(--color-danger)', 
        borderRadius: '8px',
        overflow: 'hidden',
        border: isZero ? '1px solid var(--separator)' : 'none',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {(passedPercentage > 0) && (
          <div style={{
            height: '100%',
            width: `${passedPercentage}%`,
            backgroundColor: isZero ? 'var(--color-success)' : 'var(--color-warning)', 
            transition: 'width 1s linear',
            borderRight: isZero ? 'none' : '1px solid rgba(0,0,0,0.1)'
          }} />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
