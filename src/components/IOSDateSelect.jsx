import React, { useState } from 'react';

// Generates an array of numbers
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => i + start);

// Formats a US Date String from parts: "MM/DD/YYYY HH:mm:ss AM"
const formatUS = (m, d, y, h, min, s, p) => {
  const pad = n => String(n).padStart(2, '0');
  return `${pad(m)}/${pad(d)}/${y} ${pad(h)}:${pad(min)}:${pad(s)} ${p}`;
};

const IOSDateSelect = ({ value, onChange }) => {
  const [pasteBuf, setPasteBuf] = useState('');
  
  let m='', d='', y='', h='', min='', s='', p='';
  if (value) {
    const timeMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})\s+(AM|PM)$/i);
    if (timeMatch) {
      m = parseInt(timeMatch[1], 10);
      d = parseInt(timeMatch[2], 10);
      y = parseInt(timeMatch[3], 10);
      h = parseInt(timeMatch[4], 10);
      min = parseInt(timeMatch[5], 10);
      s = parseInt(timeMatch[6], 10);
      p = timeMatch[7].toUpperCase();
    }
  }

  const handleSelect = (field, newVal) => {
    let newM=m||4, newD=d||6, newY=y||2026, newH=h||12, newMin=min||0, newS=s||0, newP=p||'PM';
    if (field === 'm') newM = newVal;
    if (field === 'd') newD = newVal;
    if (field === 'y') newY = newVal;
    if (field === 'h') newH = newVal;
    if (field === 'min') newMin = newVal;
    if (field === 's') newS = newVal;
    if (field === 'p') newP = newVal;
    onChange(formatUS(newM, newD, newY, newH, newMin, newS, newP));
  };

  const handlePaste = (e) => {
    const val = e.target.value;
    setPasteBuf(val);
    const timeMatch = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})\s+(AM|PM)$/i);
    if (timeMatch) {
      onChange(formatUS(
        timeMatch[1], timeMatch[2], timeMatch[3], 
        timeMatch[4], timeMatch[5], timeMatch[6], 
        timeMatch[7].toUpperCase()
      ));
      setPasteBuf(''); // clear after successful parse
    }
  };

  const selStyle = {
    padding: '8px 4px',
    borderRadius: '8px',
    border: '1px solid var(--separator)',
    backgroundColor: 'var(--panel-bg)',
    color: 'var(--text-main)',
    marginRight: '2px',
    fontSize: '14px',
    fontFamily: 'monospace',
    cursor: 'pointer'
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <input 
        type="text" 
        value={pasteBuf}
        onChange={handlePaste}
        placeholder="Ctrl+V вставить форму: 04/06/2026 04:02:01 PM"
        style={{
          width: '100%', padding: '10px', borderRadius: '8px', 
          border: '1px dashed var(--accent)', backgroundColor: 'rgba(0,0,0,0.05)',
          color: 'var(--text-main)', marginBottom: '8px', fontSize: '14px',
          outline: 'none'
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', alignItems: 'center' }}>
        <select value={m} onChange={(e)=>handleSelect('m', parseInt(e.target.value, 10))} style={selStyle}>
          {m==='' && <option value="">-</option>}
          {range(1, 12).map(n => <option key={n} value={n}>{String(n).padStart(2, '0')}</option>)}
        </select>
        <span>/</span>
        <select value={d} onChange={(e)=>handleSelect('d', parseInt(e.target.value, 10))} style={selStyle}>
          {d==='' && <option value="">-</option>}
          {range(1, 31).map(n => <option key={n} value={n}>{String(n).padStart(2, '0')}</option>)}
        </select>
        <span>/</span>
        <select value={y} onChange={(e)=>handleSelect('y', parseInt(e.target.value, 10))} style={selStyle}>
          {y==='' && <option value="">-</option>}
          {range(2024, 2035).map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        
        <select value={h} onChange={(e)=>handleSelect('h', parseInt(e.target.value, 10))} style={{...selStyle, marginLeft: '6px'}}>
          {h==='' && <option value="">-</option>}
          {range(1, 12).map(n => <option key={n} value={n}>{String(n).padStart(2, '0')}</option>)}
        </select>
        <span>:</span>
        <select value={min} onChange={(e)=>handleSelect('min', parseInt(e.target.value, 10))} style={selStyle}>
          {min==='' && <option value="">-</option>}
          {range(0, 59).map(n => <option key={n} value={n}>{String(n).padStart(2, '0')}</option>)}
        </select>
        <span>:</span>
        <select value={s} onChange={(e)=>handleSelect('s', parseInt(e.target.value, 10))} style={selStyle}>
          {s==='' && <option value="">-</option>}
          {range(0, 59).map(n => <option key={n} value={n}>{String(n).padStart(2, '0')}</option>)}
        </select>
        
        <select value={p} onChange={(e)=>handleSelect('p', e.target.value)} style={{...selStyle, marginLeft: '6px', fontWeight: 'bold'}}>
          {p==='' && <option value="">-</option>}
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default IOSDateSelect;
