import { FFmpeg } from '@ffmpeg/ffmpeg';
import { SpeedPreset } from '../types';

/**
 * Video Export Utility
 * Handles client-side video encoding using ffmpeg.wasm
 */

export interface VideoExportOptions {
  tokens: string[];
  speedPreset: SpeedPreset;
  onProgress?: (progress: number) => void;
  onComplete?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}

export class VideoExporter {
  private ffmpeg = new FFmpeg();

  private isInitialized = false;

  /**
   * Initialize ffmpeg.wasm
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const coreURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js';
      await this.ffmpeg.load({
        coreURL: coreURL,
      });
      this.isInitialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize FFmpeg: ${error}`);
    }
  }

  /**
   * Get timing configuration for video encoding
   */
  private getTimingConfig(speedPreset: SpeedPreset): {
    letterHold: number;
    poseTransition: number;
    interLetterPause: number;
    spacePause: number;
  } {
    const configs = {
      slow: { letterHold: 500, poseTransition: 200, interLetterPause: 300, spacePause: 500 },
      mid: { letterHold: 350, poseTransition: 200, interLetterPause: 300, spacePause: 500 },
      fast: { letterHold: 200, poseTransition: 200, interLetterPause: 300, spacePause: 500 },
    };
    return configs[speedPreset];
  }

  /**
   * Generate filename for exported video
   */
  private generateFilename(speedPreset: SpeedPreset): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    return `sema-${dateStr}-${timeStr}-${speedPreset}.mp4`;
  }

  /**
   * Create canvas frames for animation
   */
  private async createAnimationFrames(
    tokens: string[],
    speedPreset: SpeedPreset,
    onProgress?: (progress: number) => void
  ): Promise<{ frames: string[]; duration: number }> {
    const timing = this.getTimingConfig(speedPreset);
    const frames: string[] = [];
    let totalDuration = 0;

    // This is a simplified implementation
    // In a real scenario, you would render each frame of the animation
    // using canvas or capture from DOM elements

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // Determine hold time for this token
      let holdTime = timing.letterHold;
      if (token === ' ') {
        holdTime = timing.spacePause;
      }

      // Calculate number of frames for this pose (30fps)
      const poseFrames = Math.ceil((holdTime + timing.poseTransition) / 1000 * 30);

      // Generate frames for this pose
      for (let frame = 0; frame < poseFrames; frame++) {
        // In a real implementation, you would:
        // 1. Render the character with current pose to canvas
        // 2. Add watermark
        // 3. Convert canvas to data URL

        // For demo purposes, we'll create placeholder frames
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Background
          ctx.fillStyle = '#f0f8ff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Add text showing current pose
          ctx.fillStyle = '#333';
          ctx.font = 'bold 48px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(
            token === ' ' ? 'READY' : `Letter: ${token}`,
            canvas.width / 2,
            canvas.height / 2
          );

          // Add watermark
          ctx.fillStyle = '#666';
          ctx.font = '24px Arial';
          ctx.textAlign = 'right';
          ctx.fillText(
            `sema.app • Kecepatan: ${speedPreset.charAt(0).toUpperCase() + speedPreset.slice(1)}`,
            canvas.width - 20,
            canvas.height - 20
          );

          // Add frame number
          ctx.fillStyle = '#999';
          ctx.font = '16px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(`Frame: ${frames.length + 1}`, 20, canvas.height - 20);
        }

        frames.push(canvas.toDataURL('image/png'));

        // Update progress
        const progress = (i + frame / poseFrames) / tokens.length * 80; // 80% for frame generation
        onProgress?.(progress);
      }

      totalDuration += holdTime + timing.interLetterPause;
    }

    return { frames, duration: totalDuration / 1000 }; // Convert to seconds
  }

  /**
   * Export video using ffmpeg.wasm
   */
  async exportVideo(options: VideoExportOptions): Promise<void> {
    try {
      // Initialize ffmpeg if not already done
      await this.initialize();

      options.onProgress?.(5); // 5% for initialization

      // Generate animation frames
      const { frames, duration } = await this.createAnimationFrames(
        options.tokens,
        options.speedPreset,
        (progress) => options.onProgress?.(5 + progress * 0.8) // 5-85% for frame generation
      );

      options.onProgress?.(90); // 90% - frames ready

      // Create a temporary input file for ffmpeg
      const frameFilename = 'frame_%03d.png';

      // Write frames to ffmpeg virtual file system
      for (let i = 0; i < frames.length; i++) {
        const frameData = frames[i].split(',')[1]; // Remove data URL prefix
        const frameName = `frame_${String(i + 1).padStart(3, '0')}.png`;
        await this.ffmpeg.writeFile(frameName, new Uint8Array(atob(frameData).split('').map(c => c.charCodeAt(0))));
      }

      options.onProgress?.(95); // 95% - frames written

      // Run ffmpeg to create video
      const outputFilename = this.generateFilename(options.speedPreset);

      await this.ffmpeg.exec([
        '-framerate', '30',
        '-i', frameFilename,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-pix_fmt', 'yuv420p',
        '-r', '30',
        '-t', duration.toString(),
        '-y', // Overwrite output file
        outputFilename
      ]);

      options.onProgress?.(98); // 98% - video encoded

      // Read the output file
      const data = await this.ffmpeg.readFile(outputFilename);
      const blob = new Blob([data], { type: 'video/mp4' });

      // Clean up temporary files
      for (let i = 1; i <= frames.length; i++) {
        const frameName = `frame_${String(i).padStart(3, '0')}.png`;
        try {
          await this.ffmpeg.deleteFile(frameName);
        } catch (e) {
          // Ignore file not found errors
        }
      }
      await this.ffmpeg.deleteFile(outputFilename);

      options.onProgress?.(100); // 100% - complete
      options.onComplete?.(blob);

    } catch (error) {
      console.error('Video export error:', error);
      options.onError?.(error instanceof Error ? error : new Error('Unknown export error'));
    }
  }

  /**
   * Download video blob to user's computer
   */
  static downloadVideo(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Singleton instance
export const videoExporter = new VideoExporter();