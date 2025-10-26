import { AnimationOptions, AnimationState, SemaphorePose } from '../types';

/**
 * Animation timing configuration for different speed presets
 */
const SPEED_CONFIG = {
  slow: {
    letterHold: 500,    // ms to hold each letter pose
    poseTransition: 200, // ms for pose transition animation
    interLetterPause: 300, // ms pause between letters
    spacePause: 500,    // ms pause on spaces (reset to READY)
  },
  mid: {
    letterHold: 350,
    poseTransition: 200,
    interLetterPause: 300,
    spacePause: 500,
  },
  fast: {
    letterHold: 200,
    poseTransition: 200,
    interLetterPause: 300,
    spacePause: 500,
  },
};

/**
 * Animation Engine class
 * Manages the timing and state of semaphore animations
 */
export class AnimationEngine {
  private state: AnimationState;
  private config: AnimationOptions;
  private timers: NodeJS.Timeout[] = [];
  private onStateChange?: (state: AnimationState) => void;
  private onPoseChange?: (pose: SemaphorePose) => void;

  constructor(
    initialTokens: string[] = [],
    initialConfig: AnimationOptions = { speedPreset: 'mid', loop: false }
  ) {
    this.state = {
      isPlaying: false,
      isPaused: false,
      currentPosition: 0,
      tokens: initialTokens,
      currentPose: 'READY' as SemaphorePose,
    };
    this.config = initialConfig;
  }

  /**
   * Set callback for state changes
   */
  setOnStateChange(callback: (state: AnimationState) => void): void {
    this.onStateChange = callback;
  }

  /**
   * Set callback for pose changes
   */
  setOnPoseChange(callback: (pose: SemaphorePose) => void): void {
    this.onPoseChange = callback;
  }

  /**
   * Get current animation state
   */
  getState(): AnimationState {
    return { ...this.state };
  }

  /**
   * Update animation configuration
   */
  updateConfig(newConfig: Partial<AnimationOptions>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Update tokens for animation
   */
  updateTokens(tokens: string[]): void {
    this.stop();
    this.state.tokens = tokens;
    this.state.currentPosition = 0;
    this.state.currentPose = 'READY' as SemaphorePose;
    this.notifyStateChange();
  }

  /**
   * Start or resume animation
   */
  play(): void {
    if (this.state.tokens.length === 0) return;

    if (this.state.isPaused) {
      // Resume from paused position
      this.state.isPaused = false;
      this.state.isPlaying = true;
      this.notifyStateChange();
      this.animateFromCurrentPosition();
    } else {
      // Start from beginning
      this.stop();
      this.state.isPlaying = true;
      this.state.currentPosition = 0;
      this.state.currentPose = 'READY' as SemaphorePose;
      this.notifyStateChange();
      this.startAnimationSequence();
    }
  }

  /**
   * Pause animation
   */
  pause(): void {
    if (!this.state.isPlaying) return;

    this.clearAllTimers();
    this.state.isPlaying = false;
    this.state.isPaused = true;
    this.notifyStateChange();
  }

  /**
   * Stop animation and reset to beginning
   */
  stop(): void {
    this.clearAllTimers();
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.currentPosition = 0;
    this.state.currentPose = 'READY' as SemaphorePose;
    this.notifyStateChange();
    this.notifyPoseChange();
  }

  /**
   * Move to next token/position
   */
  next(): void {
    if (this.state.currentPosition < this.state.tokens.length - 1) {
      this.clearAllTimers();
      this.state.currentPosition++;
      this.updateCurrentPose();
      this.notifyStateChange();
    }
  }

  /**
   * Move to previous token/position
   */
  previous(): void {
    if (this.state.currentPosition > 0) {
      this.clearAllTimers();
      this.state.currentPosition--;
      this.updateCurrentPose();
      this.notifyStateChange();
    }
  }

  /**
   * Clear all active timers
   */
  private clearAllTimers(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];
  }

  /**
   * Notify state change to callback
   */
  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange({ ...this.state });
    }
  }

  /**
   * Notify pose change to callback
   */
  private notifyPoseChange(): void {
    if (this.onPoseChange) {
      // Validate that currentPose is a valid SemaphorePose
      const validPoses: SemaphorePose[] = [
        'READY', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ];

      if (validPoses.includes(this.state.currentPose as SemaphorePose)) {
        this.onPoseChange(this.state.currentPose as SemaphorePose);
      } else {
        console.warn('Invalid pose detected:', this.state.currentPose);
        this.onPoseChange('READY');
      }
    }
  }

  /**
   * Update current pose based on current position
   */
  private updateCurrentPose(): void {
    const currentToken = this.state.tokens[this.state.currentPosition];
    if (currentToken === ' ') {
      this.state.currentPose = 'READY' as SemaphorePose;
    } else if (currentToken && /^[A-Z]$/.test(currentToken)) {
      this.state.currentPose = currentToken as SemaphorePose;
    } else {
      this.state.currentPose = 'READY' as SemaphorePose;
    }
    this.notifyPoseChange();
  }

  /**
   * Start animation sequence from current position
   */
  private startAnimationSequence(): void {
    this.animateFromCurrentPosition();
  }

  /**
   * Continue animation from current position
   */
  private animateFromCurrentPosition(): void {
    if (!this.state.isPlaying || this.state.currentPosition >= this.state.tokens.length) {
      if (this.state.currentPosition >= this.state.tokens.length && this.config.loop) {
        this.state.currentPosition = 0;
      } else {
        this.stop();
        return;
      }
    }

    // Update current pose
    this.updateCurrentPose();

    // Get timing configuration
    const timing = SPEED_CONFIG[this.config.speedPreset];
    const currentToken = this.state.tokens[this.state.currentPosition];

    // Calculate hold time
    let holdTime = timing.letterHold;
    if (currentToken === ' ') {
      holdTime = timing.spacePause;
    }

    // Schedule next position
    const timer = setTimeout(() => {
      this.state.currentPosition++;
      this.notifyStateChange();

      // Add inter-letter pause
      const pauseTimer = setTimeout(() => {
        this.animateFromCurrentPosition();
      }, timing.interLetterPause);

      this.timers.push(pauseTimer);
    }, holdTime);

    this.timers.push(timer);
  }
}

/**
 * Play animation sequence with given tokens and options
 * @param tokens - Array of tokens to animate
 * @param options - Animation configuration options
 * @returns AnimationEngine instance
 */
export const playSequence = (
  tokens: string[],
  options: AnimationOptions
): AnimationEngine => {
  const engine = new AnimationEngine(tokens, options);
  engine.play();
  return engine;
};