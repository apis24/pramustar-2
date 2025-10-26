import React, { useState } from 'react';
import { ExportButtonProps } from '../types';
import { videoExporter, VideoExporter, VideoExportOptions } from '../utils/videoExport';

/**
 * ExportButton Component
 * Handles video export functionality with ffmpeg.wasm integration
 */
const ExportButton: React.FC<ExportButtonProps> = ({
  tokens,
  speedPreset,
  isExporting,
  onExport,
}) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (tokens.length === 0) {
      setError('No text to export');
      return;
    }

    setError(null);
    setProgress(0);
    onExport(); // Notify parent that export is starting

    try {
      const exportOptions: VideoExportOptions = {
        tokens,
        speedPreset,
        onProgress: (progressValue) => {
          setProgress(Math.round(progressValue));
        },
        onComplete: (blob) => {
          // Generate filename
          const now = new Date();
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
          const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
          const filename = `sema-${dateStr}-${timeStr}-${speedPreset}.mp4`;

          // Download the video
          VideoExporter.downloadVideo(blob, filename);

          // Reset state
          setProgress(0);
          onExport(); // Notify parent that export is complete
        },
        onError: (exportError) => {
          console.error('Export failed:', exportError);
          setError(`Export failed: ${exportError.message}`);
          setProgress(0);
          onExport(); // Notify parent that export failed
        },
      };

      await videoExporter.exportVideo(exportOptions);

    } catch (err) {
      console.error('Export error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Export failed: ${errorMessage}`);
      setProgress(0);
      onExport(); // Notify parent that export failed
    }
  };

  const isDisabled = tokens.length === 0 || isExporting;

  return (
    <div style={styles.container}>
      <button
        onClick={handleExport}
        disabled={isDisabled}
        style={{
          ...styles.button,
          ...(isDisabled ? styles.buttonDisabled : {}),
        }}
      >
        {isExporting ? (
          <span style={styles.loadingContainer}>
            <span style={styles.spinner} />
            Exporting... {progress}%
          </span>
        ) : (
          '📥 Export to MP4'
        )}
      </button>

      {isExporting && (
        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>
          <span style={styles.progressText}>{progress}%</span>
        </div>
      )}

      {error && (
        <div style={styles.errorContainer}>
          <span style={styles.errorIcon}>⚠️</span>
          <span style={styles.errorText}>{error}</span>
        </div>
      )}

      <div style={styles.infoContainer}>
        <h4 style={styles.infoTitle}>Export Information:</h4>
        <ul style={styles.infoList}>
          <li>Resolution: 1280×720</li>
          <li>Frame Rate: 30 fps</li>
          <li>Codec: H.264 MP4</li>
          <li>Watermark: "sema.app • Kecepatan: {speedPreset}"</li>
          <li>Estimated duration: ~{tokens.length * (speedPreset === 'slow' ? 1.3 : speedPreset === 'mid' ? 1.0 : 0.7)}s</li>
        </ul>
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
    textAlign: 'center',
  },
  button: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    marginBottom: '15px',
    minWidth: '200px',
  },
  buttonDisabled: {
    opacity: '0.6',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #ffffff30',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
    justifyContent: 'center',
  },
  progressBar: {
    width: '200px',
    height: '8px',
    background: '#e9ecef',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #28a745, #20c997)',
    transition: 'width 0.3s ease',
    borderRadius: '4px',
  },
  progressText: {
    fontWeight: 'bold',
    color: '#495057',
    fontSize: '14px',
    minWidth: '40px',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '6px',
    color: '#721c24',
    marginBottom: '15px',
    justifyContent: 'center',
  },
  errorIcon: {
    fontSize: '16px',
  },
  errorText: {
    fontSize: '14px',
    fontWeight: '500',
  },
  infoContainer: {
    textAlign: 'left',
    background: 'white',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
  },
  infoTitle: {
    margin: '0 0 10px 0',
    color: '#495057',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  infoList: {
    margin: '0',
    paddingLeft: '20px',
    color: '#6c757d',
    fontSize: '13px',
  },
};

// Add keyframe animation for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default ExportButton;