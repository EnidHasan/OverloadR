import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <label className="theme-switch">
        <input 
          type="checkbox" 
          checked={isDark} 
          onChange={toggleTheme}
          aria-label="Toggle dark mode"
        />
        <span className="slider">
          <span className="icon sun">☀️</span>
          <span className="icon moon">🌙</span>
        </span>
      </label>
    </div>
  );
}

export default ThemeToggle;
