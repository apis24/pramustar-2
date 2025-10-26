import React from 'react';
import { ControlsPanelProps } from '../types';

/**
 * ControlsPanel Component
 * Provides user interface controls for managing animation playback, speed settings, and loop functionality
 */
const ControlsPanel: React.FC<ControlsPanelProps> = ({
  isPlaying,
  isPaused,
  currentPosition,
  totalTokens,
  speedPreset,
  loop,
  onPlay,
  onPause,
  onStop,
  onNext,
  onPrevious,
  onSpeedChange,
  onLoopToggle,
}) => {
  const canGoNext = currentPosition < totalTokens - 1;
  const canGoPrevious = currentPosition > 0;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Animation Controls</h3>

      {/* Playback Controls */}
      <div style={styles.section}>
        <div style={styles.controlButtons}>
          <button
            onClick={onPlay}
            disabled={isPlaying}
            style={{
              ...styles.button,
              ...styles.playButton,
              ...(isPlaying ? styles.buttonDisabled : {}),
            }}
          >
            {isPaused ? 'Resume' : 'Play'}
          </button>

          <button
            onClick={onPause}
            disabled={!isPlaying}
            style={{
              ...styles.button,
              ...styles.pauseButton,
              ...(!isPlaying ? styles.buttonDisabled : {}),
            }}
          >
            Pause
          </button>

          <button
            onClick={onStop}
            disabled={!isPlaying && !isPaused}
            style={{
              ...styles.button,
              ...styles.stopButton,
              ...(!isPlaying && !isPaused ? styles.buttonDisabled : {}),
            }}
          >
            Stop
          </button>

          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            style={{
              ...styles.button,
              ...styles.navButton,
              ...(!canGoPrevious ? styles.buttonDisabled : {}),
            }}
          >
            ← Previous
          </button>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            style={{
              ...styles.button,
              ...styles.navButton,
              ...(!canGoNext ? styles.buttonDisabled : {}),
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Settings */}
      <div style={styles.section}>
        <div style={styles.settings}>
          {/* Speed Controls */}
          <div style={styles.speedControls}>
            <label style={styles.label}>Speed:</label>
            {(['slow', 'mid', 'fast'] as const).map(speed => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                style={{
                  ...styles.speedButton,
                  ...(speedPreset === speed ? styles.speedButtonActive : {}),
                }}
              >
                {speed.charAt(0).toUpperCase() + speed.slice(1)}
              </button>
            ))}
          </div>

          {/* Loop Control */}
          <div style={styles.loopControl}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={loop}
                onChange={onLoopToggle}
                style={styles.checkbox}
              />
              Loop Animation
            </label>
          </div>
        </div>
      </div>

      {/* Status Display */}
      <div style={styles.section}>
        <div style={styles.statusDisplay}>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Status:</span>
            <span style={{
              ...styles.statusValue,
              ...(isPlaying ? styles.statusPlaying : isPaused ? styles.statusPaused : styles.statusStopped)
            }}>
              {isPlaying ? 'Playing' : isPaused ? 'Paused' : 'Stopped'}
            </span>
          </div>

          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Position:</span>
            <span style={styles.statusValue}>
              {currentPosition + 1} / {totalTokens}
            </span>
          </div>

          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Speed:</span>
            <span style={styles.statusValue}>
              {speedPreset.charAt(0).toUpperCase() + speedPreset.slice(1)}
            </span>
          </div>

          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Loop:</span>
            <span style={styles.statusValue}>
              {loop ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.section}>
        <div style={styles.progressContainer}>
          <label style={styles.label}>Progress:</label>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${totalTokens > 0 ? ((currentPosition + 1) / totalTokens) * 100 : 0}%`,
              }}
            />
          </div>
          <span style={styles.progressText}>
            {Math.round(totalTokens > 0 ? ((currentPosition + 1) / totalTokens) * 100 : 0)}%
          </span>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '25px',
    background: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    margin: '20px 0',
  },
  title: {
    margin: '0 0 20px 0',
    color: '#495057',
    fontSize: '1.3em',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: '20px',
  },
  controlButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '80px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  buttonDisabled: {
    opacity: '0.5',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  playButton: {
    background: '#28a745',
    color: 'white',
  },
  pauseButton: {
    background: '#ffc107',
    color: '#212529',
  },
  stopButton: {
    background: '#dc3545',
    color: 'white',
  },
  navButton: {
    background: '#6c757d',
    color: 'white',
  },
  settings: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  speedControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  label: {
    fontWeight: 'bold',
    color: '#495057',
    fontSize: '14px',
  },
  speedButton: {
    padding: '8px 16px',
    border: '2px solid #007bff',
    background: 'white',
    color: '#007bff',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  speedButtonActive: {
    background: '#007bff',
    color: 'white',
  },
  loopControl: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
    color: '#495057',
    cursor: 'pointer',
    fontSize: '14px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  statusDisplay: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    padding: '15px',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontWeight: 'bold',
    color: '#495057',
    fontSize: '13px',
  },
  statusValue: {
    fontWeight: 'normal',
    color: '#212529',
    fontSize: '13px',
  },
  statusPlaying: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  statusPaused: {
    color: '#ffc107',
    fontWeight: 'bold',
  },
  statusStopped: {
    color: '#6c757d',
    fontWeight: 'bold',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  progressBar: {
    flex: 1,
    height: '8px',
    background: '#e9ecef',
    borderRadius: '4px',
    overflow: 'hidden',
    minHeight: '8px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #28a745, #20c997)',
    transition: 'width 0.3s ease',
    borderRadius: '4px',
  },
  progressText: {
    minWidth: '45px',
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#495057',
    fontSize: '13px',
  },
};

export default ControlsPanel;