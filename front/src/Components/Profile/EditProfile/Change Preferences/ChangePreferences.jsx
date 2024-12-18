import React, { useEffect, useState } from 'react';
import './ChangePreferences.css';

function ChangePreferences() {
  const [isModeDark, setIsModeDark] = useState(false);

  const setDarkMode = () => {
    document.querySelector('body').setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark'); // Save theme in localStorage
  };

  const setLightMode = () => {
    document.querySelector('body').setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light'); // Save theme in localStorage
  };

  const handleChangeTheme = (e) => {
    const selectedTheme = e.target.value;
    if (selectedTheme === 'dark') {
      setDarkMode();
      setIsModeDark(true);
    } else {
      setLightMode();
      setIsModeDark(false);
    }
  };

  useEffect(() => {
    const storedMode = localStorage.getItem('theme');
    if (storedMode === 'light') {
      setLightMode();
      setIsModeDark(false);
    } else {
      setDarkMode();
      setIsModeDark(true);
    }
  }, []);

  return (
    <div>
      <h1>Change Preferences:</h1>
      <br />
      <h2>Change Theme</h2>
      <div className='change-theme'>
        <p>Choose how your experience looks for this device.</p>
        <div className="selectBox-theme">
          <select id="mode-selector" onChange={handleChangeTheme} value={isModeDark ? 'dark' : 'light'}>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ChangePreferences;