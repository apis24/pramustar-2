/**
 * Audio utility for managing semaphore flag sound effects
 */

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();

  constructor() {
    this.initializeAudioContext();
  }

  /**
   * Initialize Web Audio API context
   */
  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  /**
   * Create a flag swish sound effect using Web Audio API
   * Generates a whoosh-like sound synthetically
   */
  private createFlagSwishSound(): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.15; // 150ms
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate noise-based whoosh sound
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 15); // Quick decay
      const noise = (Math.random() - 0.5) * 0.3;
      const lowFreq = Math.sin(2 * Math.PI * 200 * t) * 0.1;
      const highFreq = Math.sin(2 * Math.PI * 800 * t) * 0.05;

      data[i] = (noise + lowFreq + highFreq) * envelope;
    }

    return buffer;
  }

  /**
   * Ensure audio context is resumed (required by some browsers)
   */
  public async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Load and cache audio files
   */
  public async loadSounds(): Promise<void> {
    if (!this.audioContext) return;

    // Create flag swish sound synthetically
    const flagSwishBuffer = this.createFlagSwishSound();
    if (flagSwishBuffer) {
      this.audioBuffers.set('flag-swish', flagSwishBuffer);
    }
  }

  /**
   * Play a sound effect
   * @param soundName Name of the sound to play
   */
  public playSound(soundName: string): void {
    if (!this.audioContext || !this.audioBuffers.has(soundName)) return;

    const buffer = this.audioBuffers.get(soundName);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Set volume
    gainNode.gain.value = 0.3;

    // Play the sound
    source.start(0);
  }

  /**
   * Play flag swish sound effect
   */
  public playFlagSwish(): void {
    this.playSound('flag-swish');
  }

  /**
   * Clean up audio resources
   */
  public dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.audioBuffers.clear();
  }
}

// Singleton instance for the app
export const audioManager = new AudioManager();