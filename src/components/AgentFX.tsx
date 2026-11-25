import React from 'react';
import { clamp, ease, FONT_MONO, FONT_SANS, spring, UI } from '../theme';

export interface LaserTether {
  x: number;
  y: number;
  color: string;
  label?: string;
}

export interface FlyingClipSpec {
  id: string;
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  progress: number; // 0..1
  color: string;
  label: string;
}

/**
 * Hyper-kinetic Polaris AI Agent & Multi-Tether Laser FX Layer (1920×1080 SVG + HTML overlay).
 * Renders the expressive luminous Polaris Star-Agent, multi-channel plasma Bezier tethers
 * firing simultaneously across Plugins, Folders, Monitor, and Timeline Tracks,
 * plus flying holographic clip cards with comet trails and landing shockwaves!
 */
export const AgentFXLayer: React.FC<{
  t: number;
  agentX: number;
  agentY: number;
  overdrive: boolean;
  mood: 'ready' | 'hyper' | 'slice' | 'fix' | 'cheer';
  tethers: LaserTether[];
  flyingClips: FlyingClipSpec[];
  speech?: string;
  sliceLine?: { x: number; y1: number; y2: number; progress: number };
}> = ({
  t,
  agentX,
  agentY,
  overdrive,
  mood,
  tethers,
  flyingClips,
  speech,
  sliceLine,
}) => {
  const bob = Math.sin(t * 9) * 5;
  const ax = agentX;
  const ay = agentY + bob;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40 }}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      >
        <defs>
          <filter id="neonGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Multi-Channel Plasma Bezier Laser Tethers */}
        {tethers.map((te, idx) => {
          const cx = (ax + te.x) / 2 + (idx % 2 ? 45 : -45);
          const cy = Math.min(ay, te.y) - 65 - (idx % 3) * 24;
          const d = `M ${ax} ${ay} Q ${cx} ${cy} ${te.x} ${te.y}`;
          return (
            <g key={idx}>
              {/* Outer wide soft plasma aura */}
              <path
                d={d}
                fill="none"
                stroke={te.color}
                strokeWidth={overdrive ? 20 : 14}
                strokeLinecap="round"
                opacity="0.12"
              />
              {/* Mid plasma glow */}
              <path
                d={d}
                fill="none"
                stroke={te.color}
                strokeWidth={overdrive ? 10 : 7}
                strokeLinecap="round"
                opacity="0.28"
              />
              {/* Core beam */}
              <path
                d={d}
                fill="none"
                stroke={te.color}
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* High-speed traveling data pulses */}
              <path
                d={d}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.4"
                strokeDasharray="16 28"
                strokeDashoffset={-t * 420 - idx * 40}
                strokeLinecap="round"
              />
              {/* Target impact lock ring */}
              <circle
                cx={te.x}
                cy={te.y}
                r={10 + 5 * Math.sin(t * 18 + idx)}
                fill="none"
                stroke={te.color}
                strokeWidth="2.5"
                opacity="0.9"
              />
              <circle cx={te.x} cy={te.y} r="4.5" fill="#ffffff" />
            </g>
          );
        })}

        {/* 2. Flying Holographic Clip Projectiles + Comet Trails + Landing Shockwaves */}
        {flyingClips.map((fc) => {
          if (fc.progress <= 0 || fc.progress >= 1.15) return null;
          const p = clamp(fc.progress);
          const ep = ease(p);
          const mx = (fc.sx + fc.ex) / 2;
          const my = Math.min(fc.sy, fc.ey) - 110;
          // Quadratic Bezier point
          const inv = 1 - ep;
          const bx = inv * inv * fc.sx + 2 * inv * ep * mx + ep * ep * fc.ex;
          const by = inv * inv * fc.sy + 2 * inv * ep * my + ep * ep * fc.ey;

          // Landing impact ring when progress is near 1.0
          const impactP = clamp((fc.progress - 0.88) / 0.27);
          return (
            <g key={fc.id}>
              {p < 0.96 && (
                <>
                  {/* Dashed parabolic arc */}
                  <path
                    d={`M ${fc.sx} ${fc.sy} Q ${mx} ${my} ${fc.ex} ${fc.ey}`}
                    fill="none"
                    stroke={fc.color}
                    strokeWidth="2"
                    strokeDasharray="6 8"
                    opacity="0.38"
                  />
                  {/* Flying mini clip card */}
                  <g transform={`translate(${bx - 56}, ${by - 18}) rotate(${(1 - ep) * -12})`}>
                    <rect
                      x="-4"
                      y="-4"
                      width="120"
                      height="44"
                      rx="11"
                      fill={fc.color}
                      opacity="0.22"
                    />
                    <rect
                      width="112"
                      height="36"
                      rx="8"
                      fill="#12151f"
                      stroke={fc.color}
                      strokeWidth="2.4"
                    />
                    <rect x="6" y="6" width="8" height="24" rx="3" fill={fc.color} />
                    <text
                      x="22"
                      y="23"
                      fill="#ffffff"
                      fontFamily={FONT_MONO}
                      fontSize="12"
                      fontWeight="700"
                    >
                      {fc.label}
                    </text>
                  </g>
                </>
              )}
              {impactP > 0 && impactP < 1 && (
                <circle
                  cx={fc.ex}
                  cy={fc.ey}
                  r={12 + impactP * 54}
                  fill="none"
                  stroke={fc.color}
                  strokeWidth={3.5 * (1 - impactP)}
                  opacity={1 - impactP}
                />
              )}
            </g>
          );
        })}

        {/* 3. Plasma Slice Blade Effect */}
        {sliceLine && sliceLine.progress > 0 && sliceLine.progress < 1 && (
          <g>
            <line
              x1={sliceLine.x}
              y1={sliceLine.y1}
              x2={sliceLine.x}
              y2={sliceLine.y1 + (sliceLine.y2 - sliceLine.y1) * ease(sliceLine.progress)}
              stroke="#ef4444"
              strokeWidth="16"
              opacity="0.3"
            />
            <line
              x1={sliceLine.x}
              y1={sliceLine.y1}
              x2={sliceLine.x}
              y2={sliceLine.y1 + (sliceLine.y2 - sliceLine.y1) * ease(sliceLine.progress)}
              stroke="#ffffff"
              strokeWidth="3.5"
            />
          </g>
        )}

        {/* 4. Hero Polaris Star-Agent Avatar */}
        <g transform={`translate(${ax}, ${ay})`}>
          {/* Overdrive spinning holographic halo */}
          <circle
            r={overdrive ? 56 : 42}
            fill="none"
            stroke={overdrive ? UI.magenta : UI.gold}
            strokeWidth="2"
            strokeDasharray={overdrive ? '14 8 6 8' : '24 14'}
            opacity={overdrive ? 0.9 : 0.45}
            transform={`rotate(${t * (overdrive ? 210 : 65)})`}
          />
          {overdrive && (
            <circle
              r="68"
              fill="none"
              stroke={UI.cyan}
              strokeWidth="1.5"
              strokeDasharray="8 16"
              opacity="0.65"
              transform={`rotate(${-t * 150})`}
            />
          )}

          {/* Ambient glow under Agent */}
          <circle
            r={overdrive ? 54 : 38}
            fill={overdrive ? UI.magenta : UI.goldBright}
            opacity={overdrive ? 0.18 : 0.14}
          />

          {/* Top 4-point Polaris Star Antenna */}
          <g transform={`translate(0, -40) scale(${1 + 0.14 * Math.sin(t * 8)})`}>
            <circle r="18" fill={UI.goldBright} opacity="0.22" />
            <path
              d="M0 -14 C2.2 -3.4 3.4 -2.2 14 0 C3.4 2.2 2.2 3.4 0 14 C-2.2 3.4 -3.4 2.2 -14 0 C-3.4 -2.2 -2.2 -3.4 0 -14 Z"
              fill={UI.goldBright}
            />
          </g>

          {/* Sleek Obsidian-Indigo Glass Bot Chassis */}
          <rect
            x="-34"
            y="-26"
            width="68"
            height="52"
            rx="15"
            fill="#121829"
            stroke={overdrive ? UI.goldBright : UI.gold}
            strokeWidth="2.8"
          />
          {/* Inner glossy visor */}
          <rect
            x="-26"
            y="-16"
            width="52"
            height="28"
            rx="9"
            fill="#070a12"
            stroke="rgba(234, 209, 160, 0.28)"
            strokeWidth="1.2"
          />

          {/* Expressive Digital Eyes */}
          {mood === 'hyper' ? (
            <>
              <path d="M-18 -4 L-8 -1 L-18 2" fill="none" stroke={UI.goldBright} strokeWidth="3" strokeLinecap="round" />
              <path d="M18 -4 L8 -1 L18 2" fill="none" stroke={UI.cyan} strokeWidth="3" strokeLinecap="round" />
            </>
          ) : mood === 'cheer' ? (
            <>
              <path d="M-17 1 Q-11 -7 -5 1" fill="none" stroke={UI.emerald} strokeWidth="3" strokeLinecap="round" />
              <path d="M5 1 Q11 -7 17 1" fill="none" stroke={UI.emerald} strokeWidth="3" strokeLinecap="round" />
            </>
          ) : mood === 'slice' ? (
            <>
              <line x1="-18" y1="-5" x2="-6" y2="-1" stroke="#fb7185" strokeWidth="3.2" strokeLinecap="round" />
              <line x1="18" y1="-5" x2="6" y2="-1" stroke="#fb7185" strokeWidth="3.2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <rect x="-16" y="-6" width="9" height="10" rx="4.5" fill={UI.goldBright} />
              <rect x="7" y="-6" width="9" height="10" rx="4.5" fill={UI.goldBright} />
            </>
          )}

          {/* Bottom status LED strip */}
          <rect
            x="-14"
            y="16"
            width="28"
            height="4"
            rx="2"
            fill={overdrive ? UI.magenta : UI.emerald}
          />
        </g>
      </svg>

      {/* Floating Glass Speech / Telemetry Pill next to Agent */}
      {speech && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(1560, Math.max(420, ax - 110)),
            top: Math.max(70, ay - 102),
            padding: '7px 16px',
            borderRadius: 999,
            background: 'rgba(13, 16, 26, 0.92)',
            border: `1.8px solid ${overdrive ? UI.magenta : UI.goldBright}`,
            boxShadow: `0 8px 26px rgba(0,0,0,0.6), 0 0 18px ${overdrive ? UI.magenta : UI.goldBright}55`,
            color: '#ffffff',
            fontFamily: FONT_SANS,
            fontSize: 15,
            fontWeight: 800,
            whiteSpace: 'nowrap',
            transform: `scale(${0.92 + 0.08 * spring((t * 2) % 1)})`,
          }}
        >
          {speech}
        </div>
      )}
    </div>
  );
};
