import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PositionCard from './components/PositionCard';
import AddPositionModal from './components/AddPositionModal';
import EditPositionModal from './components/EditPositionModal';
import { calculateTimeRemaining } from './utils';

function App() {
  const [theme, setTheme] = useState('dark');
  const [positions, setPositions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [overridePosition, setOverridePosition] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // track which ID is being targeted for deletion

  // Load state from local storage and apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedPositions = JSON.parse(localStorage.getItem('positions') || '[]');
    setPositions(savedPositions);
  }, []);

  // Sync theme
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Sync positions to local storage
  const savePositions = (newPositions) => {
    setPositions(newPositions);
    localStorage.setItem('positions', JSON.stringify(newPositions));
  };

  const handleAddPosition = (position) => {
    savePositions([...positions, position]);
    setShowAddModal(false);
  };

  const requestDeletePosition = (id) => {
    setDeleteId(id);
  };

  const confirmDeletePosition = () => {
    if (deleteId) {
      savePositions(positions.filter(pos => pos.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleUpdatePosition = (positionId, newPos) => {
    const updated = positions.map(pos => 
      pos.id === positionId ? newPos : pos
    );
    savePositions(updated);
    
    // Update the local modal state so it reflects instantly for re-renders
    setOverridePosition(newPos);
  };

  const getSortScore = (pos) => {
    const t1 = calculateTimeRemaining(pos.geminiPro, pos.overrides?.geminiPro);
    const t2 = calculateTimeRemaining(pos.geminiFlash, pos.overrides?.geminiFlash);
    const t3 = calculateTimeRemaining(pos.claude, pos.overrides?.claude);
    
    const includeClaude = pos.claudeEnabled !== false;

    let zeroes = (t1.isZero ? 1 : 0) + (t2.isZero ? 1 : 0);
    if (includeClaude && t3.isZero) zeroes += 1;
    
    let minWait = Infinity;
    if (!t1.isZero) minWait = Math.min(minWait, t1.remainingMs);
    if (!t2.isZero) minWait = Math.min(minWait, t2.remainingMs);
    if (includeClaude && !t3.isZero) minWait = Math.min(minWait, t3.remainingMs);
    
    return { zeroes, minWait };
  };

  const sortedPositions = [...positions].sort((a, b) => {
    const sA = getSortScore(a);
    const sB = getSortScore(b);
    
    if (sA.zeroes !== sB.zeroes) return sB.zeroes - sA.zeroes; // more zeroes first
    return sA.minWait - sB.minWait; // shorter wait time first
  });

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '100vh', padding: '16px', paddingBottom: '80px' }}>
      
      {/* Header & Theme Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 24px 0' }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800' }}>Аккаунты</h1>
        
        <div style={{ display: 'flex', background: 'var(--panel-bg)', borderRadius: '16px', padding: '4px', boxShadow: 'var(--shadow)' }}>
          {['light', 'dark', 'cream'].map((t) => (
            <button 
              key={t}
              onClick={() => handleThemeChange(t)}
              style={{
                padding: '6px 12px',
                borderRadius: '12px',
                background: theme === t ? 'var(--accent)' : 'transparent',
                color: theme === t ? '#fff' : 'var(--text-dim)',
                textTransform: 'capitalize',
                fontSize: '14px',
                fontWeight: theme === t ? 'bold' : 'normal',
                transition: 'background 0.2s, color 0.2s'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Positions List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {sortedPositions.map((pos, index) => (
          <PositionCard 
            key={pos.id} 
            index={index} 
            position={pos} 
            onOverrideClick={setOverridePosition}
            onDelete={requestDeletePosition}
          />
        ))}
        {positions.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '40px', fontSize: '18px' }}>
            Нет аккаунтов. Нажмите на + внизу, чтобы добавить первый!
          </p>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="ios-glass" style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: '50%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        padding: '2px', // subtle border effect
        zIndex: 100
      }}>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Plus size={32} color="#fff" />
        </button>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddPositionModal 
          onSave={handleAddPosition} 
          onClose={() => setShowAddModal(false)}
        />
      )}

      {overridePosition && (
        <EditPositionModal 
          position={overridePosition}
          onUpdate={handleUpdatePosition}
          onClose={() => setOverridePosition(null)}
        />
      )}

      {deleteId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, backdropFilter: 'blur(5px)'
        }}>
          <div className="ios-card" style={{ width: '80%', maxWidth: '320px', padding: '24px', textAlign: 'center', background: 'var(--panel-bg)', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Удалить аккаунт?</h3>
            <p style={{ margin: '0 0 24px 0', color: 'var(--text-dim)' }}>Вы уверены, что хотите безвозвратно удалить эту позицию?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setDeleteId(null)}
                style={{ flex: 1, padding: '12px', background: 'var(--bar-bg)', color: 'var(--text-main)', borderRadius: '10px', fontWeight: 'bold' }}
              >
                Отмена
              </button>
              <button 
                onClick={confirmDeletePosition}
                style={{ flex: 1, padding: '12px', background: 'var(--color-danger)', color: '#fff', borderRadius: '10px', fontWeight: 'bold' }}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
