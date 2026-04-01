import React, { useState, useEffect } from 'react';
import Picker from 'react-mobile-picker';

const IOSRefreshPicker = ({ days, hours, onChange, disabled }) => {
  const [pickerValue, setPickerValue] = useState({
    d: String(days || 0),
    h: String(hours || 0)
  });

  // Sync internal state if external props change
  useEffect(() => {
    setPickerValue({
      d: String(days || 0),
      h: String(hours || 0)
    });
  }, [days, hours]);

  const handlePickerChange = (newValue) => {
    setPickerValue(newValue);
    onChange(newValue.d, newValue.h);
  };

  const daysOptions = Array.from({ length: 31 }, (_, i) => String(i));
  const hoursOptions = Array.from({ length: 24 }, (_, i) => String(i));

  return (
    <div style={{ 
      opacity: disabled ? 0.5 : 1, 
      pointerEvents: disabled ? 'none' : 'auto',
      marginTop: '8px'
    }}>
      <div style={{
          backgroundColor: 'var(--bg-color)',
          borderRadius: '16px',
          padding: '4px',
          border: '1px solid var(--separator)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)',
          overflow: 'hidden'
      }}>
        <Picker value={pickerValue} onChange={handlePickerChange} wheelMode="normal">
          <Picker.Column name="d">
            {daysOptions.map(option => (
              <Picker.Item key={option} value={option}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <span>{option}</span>
                  <span style={{ fontSize: '12px', opacity: 0.6 }}>дн.</span>
                </div>
              </Picker.Item>
            ))}
          </Picker.Column>
          <Picker.Column name="h">
            {hoursOptions.map(option => (
              <Picker.Item key={option} value={option}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <span>{option}</span>
                  <span style={{ fontSize: '12px', opacity: 0.6 }}>час.</span>
                </div>
              </Picker.Item>
            ))}
          </Picker.Column>
        </Picker>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', fontWeight: '500' }}>
        <span>Дни</span>
        <span>Часы</span>
      </div>
    </div>
  );
};

export default IOSRefreshPicker;
