import React, { useState, useCallback } from 'react';
import { TextInputProps } from '../types';
import { parseText, filterValidTokens } from '../utils/textParser';

/**
 * TextInput Component
 * Single-line input with maxLength=75 that parses text into animation tokens
 */
const TextInput: React.FC<TextInputProps> = ({ onTextChange, value = '' }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Enforce maxLength of 75 characters
    if (newValue.length > 75) {
      return;
    }

    setInputValue(newValue);

    // Parse the text and filter for valid semaphore characters
    const tokens = parseText(newValue);
    const validTokens = filterValidTokens(tokens);

    // Pass parsed tokens to parent component
    onTextChange(validTokens);
  }, [onTextChange]);

  return (
    <div style={styles.container}>
      <label htmlFor="semaphore-input" style={styles.label}>
        Input Text:
      </label>
      <input
        id="semaphore-input"
        type="text"
        value={inputValue}
        onChange={handleChange}
        maxLength={75}
        placeholder="Enter text to animate (A-Z and spaces only)"
        style={styles.input}
      />
      <div style={styles.characterCount}>
        {inputValue.length}/75 characters
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    transition: 'border-color 0.2s ease',
  },
  characterCount: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'right',
  },
};

export default TextInput;