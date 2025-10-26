import React, { useEffect, useRef, useState } from 'react';
import { CharacterProps } from '../types';
import { SEMAPHORE_POSITIONS, angleToCoordinates } from '../utils/semaphorePoses';
import { audioManager } from '../utils/audio';

interface Expression {
  eyes: string;
  mouth: string;
}

/**
 * Character Component
 * Renders SVG-based semaphore character with expressions and plays sound effects
 */
const Character: React.FC<CharacterProps> = ({ pose }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentExpression, setCurrentExpression] = useState<Expression>({ eyes: '😊', mouth: '😊' });

  // Available expressions for the character
  const expressions: Expression[] = [
    { eyes: '😊', mouth: '😊' },  // Happy
    { eyes: '😃', mouth: '😃' },  // Excited
    { eyes: '😎', mouth: '😎' },  // Cool
    { eyes: '🤓', mouth: '🤓' },  // Nerdy
    { eyes: '😌', mouth: '😌' },  // Calm
  ];

  // SVG dimensions and styling
  const svgWidth = 400;
  const svgHeight = 500;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2 - 50;
  const armLength = 120;
  const bodyHeight = 150;

  // Get current arm position
  const armPosition = SEMAPHORE_POSITIONS[pose];
  const [leftArmX, leftArmY] = angleToCoordinates(
    armPosition.leftArm,
    armLength,
    centerX,
    centerY - 20
  );
  const [rightArmX, rightArmY] = angleToCoordinates(
    armPosition.rightArm,
    armLength,
    centerX,
    centerY - 20
  );

  // Initialize audio and handle pose changes
  useEffect(() => {
    // Initialize audio on first user interaction
    const initializeAudio = async () => {
      await audioManager.resumeAudioContext();
      await audioManager.loadSounds();
    };

    // Handle any user interaction to initialize audio
    const handleUserInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Handle pose changes
  useEffect(() => {
    // Play flag swish sound when pose changes
    audioManager.playFlagSwish();

    // Randomize expression for letters, reset to neutral for spaces
    if (pose === 'READY') {
      setCurrentExpression(expressions[0]); // Neutral expression
    } else {
      const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
      setCurrentExpression(randomExpression);
    }
  }, [pose]);

  // Render the character using SVG
  return (
    <div style={styles.container}>
      <svg
        ref={svgRef}
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={styles.svg}
      >
        {/* Background circle for character */}
        <circle
          cx={centerX}
          cy={centerY}
          r="180"
          fill="#f0f8ff"
          stroke="#ddd"
          strokeWidth="2"
        />

        {/* Head */}
        <circle
          cx={centerX}
          cy={centerY - 120}
          r="40"
          fill="#fdbcb4"
          stroke="#333"
          strokeWidth="2"
        />

        {/* Face */}
        <g transform={`translate(${centerX}, ${centerY - 120})`}>
          {/* Eyes */}
          <circle cx="-12" cy="-8" r="3" fill="#333" />
          <circle cx="12" cy="-8" r="3" fill="#333" />

          {/* Expression indicator (emoji above head) */}
          <text
            x="0"
            y="-60"
            fontSize="24"
            textAnchor="middle"
            style={styles.expressionText}
          >
            {currentExpression.eyes}
          </text>
        </g>

        {/* Body */}
        <rect
          x={centerX - 40}
          y={centerY - 80}
          width="80"
          height={bodyHeight}
          rx="10"
          fill="#4169e1"
          stroke="#333"
          strokeWidth="2"
        />

        {/* Left arm */}
        <g>
          {/* Upper arm */}
          <line
            x1={centerX - 30}
            y1={centerY - 60}
            x2={leftArmX}
            y2={leftArmY}
            stroke="#fdbcb4"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Left flag */}
          <g transform={`translate(${leftArmX}, ${leftArmY})`}>
            <rect
              x="-5"
              y="-30"
              width="10"
              height="60"
              fill="#ff6b6b"
              stroke="#333"
              strokeWidth="1"
            />
            <polygon
              points="5,-30 5,0 35,-15"
              fill="#ff6b6b"
              stroke="#333"
              strokeWidth="1"
            />
          </g>
        </g>

        {/* Right arm */}
        <g>
          {/* Upper arm */}
          <line
            x1={centerX + 30}
            y1={centerY - 60}
            x2={rightArmX}
            y2={rightArmY}
            stroke="#fdbcb4"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Right flag */}
          <g transform={`translate(${rightArmX}, ${rightArmY})`}>
            <rect
              x="-5"
              y="-30"
              width="10"
              height="60"
              fill="#ff6b6b"
              stroke="#333"
              strokeWidth="1"
            />
            <polygon
              points="-5,-30 -5,0 -35,-15"
              fill="#ff6b6b"
              stroke="#333"
              strokeWidth="1"
            />
          </g>
        </g>

        {/* Legs */}
        <rect
          x={centerX - 30}
          y={centerY + 70}
          width="20"
          height="80"
          rx="5"
          fill="#333"
          stroke="#333"
          strokeWidth="2"
        />
        <rect
          x={centerX + 10}
          y={centerY + 70}
          width="20"
          height="80"
          rx="5"
          fill="#333"
          stroke="#333"
          strokeWidth="2"
        />

        {/* Pose indicator */}
        <text
          x={centerX}
          y={svgHeight - 20}
          fontSize="18"
          fontWeight="bold"
          textAnchor="middle"
          fill="#333"
        >
          {pose === 'READY' ? 'READY' : `Letter: ${pose}`}
        </text>
      </svg>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    margin: '20px 0',
  },
  svg: {
    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))',
  },
  expressionText: {
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))',
  },
};

export default Character;