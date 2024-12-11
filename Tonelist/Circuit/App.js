import React from 'react';

function App() {
  const handleButtonClick = (action) => {
    alert(`${action} clicked!`);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', margin: 0, backgroundColor: '#666666' }}>
      {/* Taskbar */}
      <div style={styles.taskbar}>
        {/* Top buttons */}
        <div style={styles.topButtons}>
          <button style={styles.button} onClick={() => handleButtonClick('Lyrics')} title="Lyrics"></button>
          <button style={styles.button} onClick={() => handleButtonClick('Beats')} title="Beats"></button>
          <button style={styles.button} onClick={() => handleButtonClick('Recommendations')} title="Recommendations"></button>
          <button style={styles.button} onClick={() => handleButtonClick('AI')} title="AI"></button>
        </div>
        {/* Bottom buttons */}
        <div style={styles.bottomButtons}>
          <button style={styles.button} onClick={() => handleButtonClick('Settings')} title="Settings"></button>
          <button style={styles.button} onClick={() => handleButtonClick('Type')} title="Type"></button>
        </div>
      </div>
      {/* Content */}
      <div style={styles.content}>
        <h1>Welcome to the AI Music Assistant</h1>
        <p>Click on the buttons in the taskbar to explore features!</p>
      </div>
    </div>
  );
}

const styles = {
  taskbar: {
    width: '80px',
    backgroundColor: '#2f2f2f',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
  },
  button: {
    backgroundColor: '#800080',
    border: 'none',
    width: '50px',
    height: '50px',
    borderRadius: '10px',
    margin: '10px 0',
    cursor: 'pointer',
  },
  topButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
  bottomButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  content: {
    flexGrow: 1,
    padding: '20px',
  },
};

export default App;