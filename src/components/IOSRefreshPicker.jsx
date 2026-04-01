import React, { useState, useEffect } from 'react';
import Picker from 'react-mobile-picker';

const IOSRefreshPicker = ({ value, onChange, label }) => {
  const [pickerValue, setPickerValue] = useState({
    days: value?.days || 0,
    hours: value?.hours || 0,
  });

  const selections = {
    days: Array.from({ length: 31 }, (_, i) => i),
    hours: Array.from({ length: 24 }, (_, i) => i),
  };

  useEffect(() => {
    setPickerValue({
      days: value?.days || 0,
      hours: value?.hours || 0,
    });
  }, [value]);

  const handlePickerChange = (newValue) => {
    setPickerValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="ios-picker-container">
      {label && <label className="ios-picker-label">{label}</label>}
      <div className="ios-picker-wrapper">
        <Picker
          value={pickerValue}
          onChange={handlePickerChange}
          wheelMode="natural"
        >
          {Object.keys(selections).map(name => (
            <Picker.Column key={name} name={name}>
              {selections[name].map(option => (
                <Picker.Item key={option} value={option}>
                  {({ selected }) => (
                    <div style={{ 
                      color: selected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: selected ? '600' : '400',
                      fontSize: '18px',
                      padding: '8px 0',
                      transition: 'all 0.2s ease'
                    }}>
                      {option} {name === 'days' ? 'д.' : 'ч.'}
                    </div>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
          ))}
        </Picker>
        {/* iOS Selection Overlay */}
        <div className="ios-picker-selection-highlight"></div>
      </div>
      <style>{`
        .ios-picker-container {
          margin: 16px 0;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .ios-picker-label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 12px;
          font-weight: 500;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .ios-picker-wrapper {
          position: relative;
          height: 180px;
          overflow: hidden;
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
        }
        .ios-picker-selection-highlight {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 44px;
          transform: translateY(-50%);
          background: rgba(var(--accent-primary-rgb), 0.08);
          border-top: 1px solid rgba(var(--accent-primary-rgb), 0.2);
          border-bottom: 1px solid rgba(var(--accent-primary-rgb), 0.2);
          pointer-events: none;
          z-index: 10;
          border-radius: 8px;
        }
        /* Mobile Picker overrides */
        .picker-column {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default IOSRefreshPicker;
