export type SpeedPreset = 'slow' | 'mid' | 'fast';

export interface AnimationOptions {
  speedPreset: SpeedPreset;
  loop: boolean;
}

export interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  currentPosition: number;
  tokens: string[];
  currentPose: string;
}

export type SemaphorePose = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | 'READY';

export interface TextInputProps {
  onTextChange: (tokens: string[]) => void;
  value?: string;
}

export interface CharacterProps {
  pose: SemaphorePose;
}

export interface ControlsPanelProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentPosition: number;
  totalTokens: number;
  speedPreset: SpeedPreset;
  loop: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSpeedChange: (speed: SpeedPreset) => void;
  onLoopToggle: () => void;
}

export interface ExportButtonProps {
  tokens: string[];
  speedPreset: SpeedPreset;
  isExporting: boolean;
  onExport: () => void;
}