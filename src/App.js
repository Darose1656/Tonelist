import React, { useState, useEffect } from 'react';
import './App.css';

// Named constant for button actions
const MAIN_BUTTONS = ['Lyrics', 'Beats', 'Recommendations', 'AI'];

function App() {
  const [activeButton, setActiveButton] = useState(null); // Track the active button
  const [hoverText, setHoverText] = useState(''); // Display hover text
  const [timerMessage, setTimerMessage] = useState(''); // Timer action message

  useEffect(() => {
    // onload event
    console.log('App has loaded successfully!');
  }, []);

  const handleButtonClick = (action) => {
    setActiveButton(activeButton === action ? null : action); // Toggle sub-buttons
  };

  const handleSubButtonClick = (subAction) => {
    alert(`${subAction} clicked!`);
  };

  const handleMouseOver = (buttonName) => {
    setHoverText(`You are hovering over ${buttonName}`);
    setTimeout(() => setHoverText(''), 2000); // Clear hover text after 2 seconds
  };

  const delayedAction = () => {
    const timeout = setTimeout(() => {
      setTimerMessage('This is a delayed action using setTimeout!');
      clearTimeout(timeout);
    }, 3000);
  };

  const reusableFunction = (array, prefix) => {
    return array.map((item, index) => `${prefix} ${item} ${index + 1}`);
  };

  // Example of using a reusable function
  const subButtonOptions = reusableFunction(MAIN_BUTTONS, 'Option');

  return (
    <div className="app-container">
      {/* Taskbar */}
      <div className="taskbar">
        {/* Top buttons */}
        <div className="top-buttons">
          {MAIN_BUTTONS.map((buttonName, index) => (
            <div key={index} className="button-container">
              <button
                className="taskbar-button"
                onMouseEnter={() => handleMouseOver(buttonName)} // onmouseover event
                onClick={() => handleButtonClick(buttonName)} // onclick event
              ></button>
              {/* Sub-buttons */}
              {activeButton === buttonName && (
                <div className="sub-buttons">
                  {subButtonOptions.map((subButtonName, subIndex) => (
                    <button
                      key={subIndex}
                      className="sub-button"
                      onClick={() => handleSubButtonClick(subButtonName)}
                    >
                      {subButtonName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Bottom buttons */}
        <div className="bottom-buttons">
          <button
            className="taskbar-button"
            onMouseEnter={() => handleMouseOver('Settings')}
            onClick={() => delayedAction()}
          ></button>
          <button
            className="taskbar-button"
            onMouseEnter={() => handleMouseOver('Type')}
            onClick={() => alert('Type clicked!')}
          ></button>
        </div>
      </div>
      {/* Content */}
      <div className="content">
        <h1>Welcome to the AI Music Assistant</h1>
        <p>{hoverText}</p>
        <p>{timerMessage}</p>
      </div>
    </div>
  );
}

export default App;