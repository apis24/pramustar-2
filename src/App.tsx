import React, { useState } from 'react';
import TextInput from './components/TextInput';
import Character from './components/Character';
import ControlsPanel from './components/ControlsPanel';
import ExportButton from './components/ExportButton';
import { useAnimation } from './hooks/useAnimation';
import './App.css';

function App() {
  const [tokens, setTokens] = useState<string[]>([]);
  const [speedPreset, setSpeedPreset] = useState<'slow' | 'mid' | 'fast'>('mid');
  const [loop, setLoop] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const animation = useAnimation(tokens, { speedPreset, loop });

  const handleTextChange = (parsedTokens: string[]) => {
    console.log('Parsed tokens:', parsedTokens);
    setTokens(parsedTokens);
  };

  const handleSpeedChange = (speed: 'slow' | 'mid' | 'fast') => {
    setSpeedPreset(speed);
    animation.setSpeed(speed);
  };

  const handleLoopToggle = () => {
    const newLoop = !loop;
    setLoop(newLoop);
    animation.toggleLoop();
  };

  const handleExport = () => {
    setIsExporting(!isExporting);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Semaphore Demo & Latihan</h1>
        <p>Learn semaphore flag signals through interactive animation</p>
      </header>

      <main className="App-main">
        <TextInput onTextChange={handleTextChange} />

        {/* Character Display */}
        {tokens.length > 0 && (
          <div className="character-display">
            <Character pose={animation.currentPose} />
          </div>
        )}

        {/* Animation Controls */}
        {tokens.length > 0 && (
          <ControlsPanel
            isPlaying={animation.isPlaying}
            isPaused={animation.isPaused}
            currentPosition={animation.currentPosition}
            totalTokens={animation.totalTokens}
            speedPreset={speedPreset}
            loop={loop}
            onPlay={animation.play}
            onPause={animation.pause}
            onStop={animation.stop}
            onNext={animation.next}
            onPrevious={animation.previous}
            onSpeedChange={handleSpeedChange}
            onLoopToggle={handleLoopToggle}
          />
        )}

        {/* Export Section */}
        {tokens.length > 0 && (
          <ExportButton
            tokens={tokens}
            speedPreset={speedPreset}
            isExporting={isExporting}
            onExport={handleExport}
          />
        )}

        {tokens.length > 0 && (
          <div className="tokens-display">
            <h3>Parsed Tokens ({tokens.length}):</h3>
            <div className="tokens-list">
              {tokens.map((token, index) => (
                <span
                  key={index}
                  className={`token ${index === animation.currentPosition ? 'active' : ''}`}
                >
                  {token === ' ' ? '␣' : token}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;