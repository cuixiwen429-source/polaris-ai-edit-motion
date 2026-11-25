import React from 'react';
import { COLORS, FONT_SANS } from '../theme';

export type BotMood = 'happy' | 'focused' | 'shocked' | 'proud' | 'sweat' | 'cheer';

export interface ArmTarget {
  x: number;
  y: number;
  grabbing?: boolean;
}

/**
 * Adorable boxy "北极星 AI 剪辑" Mascot with Polaris gold star crest,
 * expressive faces, bouncy legs, speech bubble, and stretchy rubber-hose SVG arms
 * that reach smoothly to any target (x, y) in the 1280x720 stage.
 */
export const PolarisBot: React.FC<{
  x: number;
  y: number;
  t: number;
  mood?: BotMood;
  leftArm?: ArmTarget;
  rightArm?: ArmTarget;
  speech?: string;
  speechSide?: 'top' | 'right' | 'left';
  scale?: number;
}> = ({
  x,
  y,
  t,
  mood = 'happy',
  leftArm,
  rightArm,
  speech,
  speechSide = 'top',
  scale = 1,
}) => {
  const bob = Math.sin(t * 7.5) * 3.5;
  const bodyX = x;
  const bodyY = y + bob;

  const leftShoulder = { x: bodyX - 24 * scale, y: bodyY + 4 * scale };
  const rightShoulder = { x: bodyX + 24 * scale, y: bodyY + 4 * scale };

  const renderArm = (
    shoulder: { x: number; y: number },
    target: ArmTarget,
    bendSign: number
  ) => {
    const mx = (shoulder.x + target.x) / 2;
    const my = (shoulder.y + target.y) / 2 + bendSign * 26;
    return (
      <g>
        {/* Outer ink stroke */}
        <path
          d={`M ${shoulder.x} ${shoulder.y} Q ${mx} ${my} ${target.x} ${target.y}`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={11 * scale}
          strokeLinecap="round"
        />
        {/* Inner Polaris gold-amber hose */}
        <path
          d={`M ${shoulder.x} ${shoulder.y} Q ${mx} ${my} ${target.x} ${target.y}`}
          fill="none"
          stroke={COLORS.polarisGold}
          strokeWidth={6.5 * scale}
          strokeLinecap="round"
        />
        {/* Hand mitt */}
        <circle
          cx={target.x}
          cy={target.y}
          r={(target.grabbing ? 8.5 : 7.2) * scale}
          fill={target.grabbing ? COLORS.polarisGoldBright : '#fffdf8'}
          stroke={COLORS.ink}
          strokeWidth={2.4 * scale}
        />
      </g>
    );
  };

  return (
    <svg
      width="1280"
      height="720"
      viewBox="0 0 1280 720"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {/* Stretchy rubber-hose arms rendered behind/around body */}
      {leftArm && renderArm(leftShoulder, leftArm, -1)}
      {rightArm && renderArm(rightShoulder, rightArm, 1)}

      {/* Mascot Body */}
      <g transform={`translate(${bodyX}, ${bodyY}) scale(${scale})`}>
        {/* Ground shadow */}
        <ellipse cx="0" cy="36" rx="28" ry="6" fill="rgba(43, 36, 32, 0.18)" />

        {/* Bouncy little legs */}
        {[-16, -6, 6, 16].map((lx, idx) => {
          const step = Math.sin(t * 10 + idx * 1.4) * 3;
          return (
            <rect
              key={idx}
              x={lx - 3}
              y={22 + (idx % 2 ? step : -step)}
              width="6"
              height="13"
              rx="3"
              fill={COLORS.polarisNavy}
              stroke={COLORS.ink}
              strokeWidth="2.2"
            />
          );
        })}

        {/* Polaris Star Antenna Crest */}
        <line x1="0" y1="-24" x2="0" y2="-36" stroke={COLORS.ink} strokeWidth="2.5" />
        <g transform={`translate(0, -40) scale(${1 + 0.1 * Math.sin(t * 6)})`}>
          <path
            d="M0 -11 C1.8 -2.8 2.8 -1.8 11 0 C2.8 1.8 1.8 2.8 0 11 C-1.8 2.8 -2.8 1.8 -11 0 C-2.8 -1.8 -1.8 -2.8 0 -11 Z"
            fill={COLORS.polarisGoldBright}
            stroke={COLORS.ink}
            strokeWidth="1.8"
          />
        </g>

        {/* Main boxy chassis (Polaris Midnight Indigo with gold trim) */}
        <rect
          x="-32"
          y="-24"
          width="64"
          height="48"
          rx="11"
          fill={COLORS.polarisNavy}
          stroke={COLORS.ink}
          strokeWidth="2.8"
        />
        {/* Warm top highlight */}
        <rect
          x="-26"
          y="-19"
          width="52"
          height="7"
          rx="3.5"
          fill="rgba(234, 209, 160, 0.25)"
        />
        {/* Side ear nubs */}
        <rect x="-38" y="-8" width="7" height="16" rx="3" fill={COLORS.polarisGold} stroke={COLORS.ink} strokeWidth="2.2" />
        <rect x="31" y="-8" width="7" height="16" rx="3" fill={COLORS.polarisGold} stroke={COLORS.ink} strokeWidth="2.2" />

        {/* Cheek blush */}
        <ellipse cx="-18" cy="6" rx="4.5" ry="2.6" fill={COLORS.polarisCoral} opacity="0.7" />
        <ellipse cx="18" cy="6" rx="4.5" ry="2.6" fill={COLORS.polarisCoral} opacity="0.7" />

        {/* Expressive Eyes & Mouth */}
        {mood === 'shocked' ? (
          <>
            <path d="M-16 -6 L-9 -1 L-16 4" fill="none" stroke={COLORS.polarisGoldBright} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M16 -6 L9 -1 L16 4" fill="none" stroke={COLORS.polarisGoldBright} strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="0" cy="9" r="5" fill={COLORS.polarisCoral} stroke="#fff" strokeWidth="1.5" />
          </>
        ) : mood === 'focused' ? (
          <>
            <rect x="-17" y="-5" width="11" height="5" rx="2.5" fill={COLORS.polarisGoldBright} />
            <rect x="6" y="-5" width="11" height="5" rx="2.5" fill={COLORS.polarisGoldBright} />
            <path d="M-6 8 L6 8" stroke="#fffdf8" strokeWidth="2.4" strokeLinecap="round" />
          </>
        ) : mood === 'cheer' || mood === 'proud' ? (
          <>
            <path d="M-16 0 Q-11 -7 -6 0" fill="none" stroke={COLORS.polarisGoldBright} strokeWidth="2.8" strokeLinecap="round" />
            <path d="M6 0 Q11 -7 16 0" fill="none" stroke={COLORS.polarisGoldBright} strokeWidth="2.8" strokeLinecap="round" />
            <path d="M-7 6 Q0 14 7 6" fill="none" stroke="#fffdf8" strokeWidth="2.6" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="-11" cy="-2" r="4.2" fill={COLORS.polarisGoldBright} />
            <circle cx="11" cy="-2" r="4.2" fill={COLORS.polarisGoldBright} />
            <circle cx="-12.5" cy="-3.5" r="1.4" fill="#ffffff" />
            <circle cx="9.5" cy="-3.5" r="1.4" fill="#ffffff" />
            <path d="M-5 7 Q0 12 5 7" fill="none" stroke="#fffdf8" strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}

        {/* Sweat drop for 99.99% suspense */}
        {mood === 'sweat' && (
          <path
            d="M22 -18 Q27 -10 22 -6 Q17 -10 22 -18 Z"
            fill={COLORS.polarisSky}
            stroke={COLORS.ink}
            strokeWidth="1.6"
          />
        )}

        {/* Speech Bubble */}
        {speech && (
          <g
            transform={
              speechSide === 'right'
                ? 'translate(48, -32)'
                : speechSide === 'left'
                  ? 'translate(-156, -32)'
                  : 'translate(-56, -86)'
            }
          >
            <rect
              x="0"
              y="0"
              width={Math.max(96, speech.length * 16 + 26)}
              height="36"
              rx="10"
              fill="#fffdf8"
              stroke={COLORS.ink}
              strokeWidth="2.4"
            />
            <text
              x={Math.max(96, speech.length * 16 + 26) / 2}
              y="23"
              textAnchor="middle"
              fill={COLORS.ink}
              fontFamily={FONT_SANS}
              fontSize="15"
              fontWeight="800"
            >
              {speech}
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
