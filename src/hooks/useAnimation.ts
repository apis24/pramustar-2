import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimationEngine } from '../utils/animation';
import { AnimationState, SpeedPreset, AnimationOptions, SemaphorePose } from '../types';

/**
 * Custom hook for managing animation state and controls
 */
export const useAnimation = (
  initialTokens: string[] = [],
  initialConfig: AnimationOptions = { speedPreset: 'mid', loop: false }
) => {
  const engineRef = useRef<AnimationEngine | null>(null);
  const [state, setState] = useState<AnimationState>({
    isPlaying: false,
    isPaused: false,
    currentPosition: 0,
    tokens: initialTokens,
    currentPose: 'READY',
  });
  const [currentPose, setCurrentPose] = useState<SemaphorePose>('READY');

  // Initialize animation engine
  useEffect(() => {
    const engine = new AnimationEngine(initialTokens, initialConfig);

    // Set up state change callback
    engine.setOnStateChange((newState) => {
      setState(newState);
    });

    // Set up pose change callback
    engine.setOnPoseChange((pose) => {
      setCurrentPose(pose);
    });

    engineRef.current = engine;

    // Cleanup on unmount
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  // Update tokens when they change
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateTokens(initialTokens);
      setState(prev => ({ ...prev, tokens: initialTokens }));
    }
  }, [initialTokens]);

  // Update configuration when it changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateConfig(initialConfig);
    }
  }, [initialConfig]);

  /**
   * Start or resume animation
   */
  const play = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.play();
    }
  }, []);

  /**
   * Pause animation
   */
  const pause = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.pause();
    }
  }, []);

  /**
   * Stop animation and reset to beginning
   */
  const stop = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
  }, []);

  /**
   * Move to next position
   */
  const next = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.next();
    }
  }, []);

  /**
   * Move to previous position
   */
  const previous = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.previous();
    }
  }, []);

  /**
   * Update speed preset
   */
  const setSpeed = useCallback((speed: SpeedPreset) => {
    if (engineRef.current) {
      engineRef.current.updateConfig({ speedPreset: speed });
    }
  }, []);

  /**
   * Toggle loop setting
   */
  const toggleLoop = useCallback(() => {
    if (engineRef.current) {
      const currentState = engineRef.current.getState();
      engineRef.current.updateConfig({ loop: !currentState.isPlaying });
    }
  }, []);

  /**
   * Check if animation can go to next position
   */
  const canGoNext = state.currentPosition < state.tokens.length - 1;

  /**
   * Check if animation can go to previous position
   */
  const canGoPrevious = state.currentPosition > 0;

  return {
    // State
    isPlaying: state.isPlaying,
    isPaused: state.isPaused,
    currentPosition: state.currentPosition,
    totalTokens: state.tokens.length,
    currentToken: state.tokens[state.currentPosition] || '',
    currentPose,
    tokens: state.tokens,

    // Controls
    play,
    pause,
    stop,
    next,
    previous,
    setSpeed,
    toggleLoop,

    // Helpers
    canGoNext,
    canGoPrevious,
  };
};