import React, { useState, useEffect } from 'react';
import Picker from 'react-mobile-picker';

// Generates an array of formatted string numbers
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => String(i + start).padStart(2, '0'));

const formatUS = (m, d, y, h, min, s, p) => {
  return `${m}/${d}/${y} ${h}:${min}:${s} ${p}`;
};

const IOSDateSelect = ({ value, onChange }) => {
  const [pasteBuf, setPasteBuf] = useState('');
  
  // Default fallback values when no date is set
  const [pickerValue, setPickerValue] = useState({
    m: '-', d: '-', y: '-', h: '-', min: '-', s: '-', p: '-'
  });

  // Sync incoming value to picker
  useEffect(() => {
    if (value) {
      const timeMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})\s+(AM|PM)$/i);
      if (timeMatch) {
        setPickerValue({
          m: String(parseInt(timeMatch[1], 10)).padStart(2, '0'),
          d: String(parseInt(timeMatch[2], 10)).padStart(2, '0'),
          y: timeMatch[3],
          h: String(parseInt(timeMatch[4], 10)).padStart(2, '0'),
          min: String(parseInt(timeMatch[5], 10)).padStart(2, '0'),
          s: String(parseInt(timeMatch[6], 10)).padStart(2, '0'),
          p: timeMatch[7].toUpperCase()
        });
      }
    } else {
      setPickerValue({
        m: '-', d: '-', y: '-', h: '-', min: '-', s: '-', p: '-'
      });
    }
  }, [value]);

  const handlePickerChange = (newValue) => {
    setPickerValue(newValue);
    
    // If any field is missing or dash, we don't emit a full valid date yet
    // but typically users will pick values. Let's auto-fill dashes to current defaults
    let finalM = newValue.m === '-' ? '04' : newValue.m;
    let finalD = newValue.d === '-' ? '06' : newValue.d;
    let finalY = newValue.y === '-' ? '2026' : newValue.y;
    let finalH = newValue.h === '-' ? '12' : newValue.h;
    let finalMin = newValue.min === '-' ? '00' : newValue.min;
    let finalS = newValue.s === '-' ? '00' : newValue.s;
    let finalP = newValue.p === '-' ? 'PM' : newValue.p;

    onChange(formatUS(finalM, finalD, finalY, finalH, finalMin, finalS, finalP));
  };

  const handlePaste = (e) => {
    const val = e.target.value;
    setPasteBuf(val);
    const timeMatch = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})\s+(AM|PM)$/i);
    if (timeMatch) {
      onChange(formatUS(
        String(parseInt(timeMatch[1], 10)).padStart(2, '0'), 
        String(parseInt(timeMatch[2], 10)).padStart(2, '0'), 
        timeMatch[3], 
        String(parseInt(timeMatch[4], 10)).padStart(2, '0'), 
        String(parseInt(timeMatch[5], 10)).padStart(2, '0'), 
        String(parseInt(timeMatch[6], 10)).padStart(2, '0'), 
        timeMatch[7].toUpperCase()
      ));
      setPasteBuf(''); // clear after successful parse
    }
  };

  const selections = {
    m: ['-', ...range(1, 12)],
    d: ['-', ...range(1, 31)],
    y: ['-', ...Array.from({length: 12}, (_, i) => String(2024 + i))],
    h: ['-', ...range(1, 12)],
    min: ['-', ...range(0, 59)],
    s: ['-', ...range(0, 59)],
    p: ['-', 'AM', 'PM']
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
      
      <div style={{
          backgroundColor: 'var(--panel-bg)',
          borderRadius: '16px',
          padding: '8px',
          border: '1px solid var(--separator)',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
          fontSize: '15px',
          fontWeight: '500',
          color: 'var(--text-main)'
      }}>
        <Picker value={pickerValue} onChange={handlePickerChange} wheelMode="normal">
          <Picker.Column name="m">
            {selections.m.map(option => <Picker.Item key={option} value={option}>{option}</Picker.Item>)}
          </Picker.Column>
          <Picker.Column name="d">
            {selections.d.map(option => <Picker.Item key={option} value={option}>{option}</Picker.Item>)}
          </Picker.Column>
          <Picker.Column name="y">
            {selections.y.map(option => <Picker.Item key={option} value={option}>{option}</Picker.Item>)}
          </Picker.Column>
          <Picker.Column name="h">
            {selections.h.map(option => <Picker.Item key={option} value={option}>{option}</Picker.Item>)}
          </Picker.Column>
          <Picker.Column name="min">
            {selections.min.map(option => <Picker.Item key={option} value={option}>{option}</Picker.Item>)}
          </Picker.Column>
          <Picker.Column name="s">
            {selections.s.map(option => <Picker.Item key={option} value={option}>{option}</Picker.Item>)}
          </Picker.Column>
          <Picker.Column name="p">
            {selections.p.map(option => <Picker.Item key={option} value={option}>{option}</Picker.Item>)}
          </Picker.Column>
        </Picker>
      </div>
      <div style={{textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px'}}>
        Месяц / День / Год / Час / Мин / Сек / AM-PM
      </div>
    </div>
  );
};

export default IOSDateSelect;
