import React from 'react';
import { ClipId, COLORS, FONT_MONO, FONT_SANS } from '../theme';

/**
 * Bespoke illustrated artwork for each clip from AstraArc_Partners_Native_v5.ccproj.
 * Renders crisply at both thumbnail size (in asset bin / timeline) and full monitor size.
 */
export const ClipArt: React.FC<{
  id: ClipId;
  t?: number;
  isMonitor?: boolean;
}> = ({ id, t = 0, isMonitor = false }) => {
  switch (id) {
    case 'dusk':
      // Act 1: 暮色地标建筑 — deep twilight skyline + glowing Polaris North Star
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="duskSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d1730" />
              <stop offset="55%" stopColor="#1e3159" />
              <stop offset="100%" stopColor="#5a4966" />
            </linearGradient>
          </defs>
          <rect width="320" height="180" fill="url(#duskSky)" />
          {/* Polaris star */}
          <g transform={`translate(240, 42) scale(${1 + 0.08 * Math.sin(t * 4)})`}>
            <path d="M0 -18 C2 -4 4 -2 18 0 C4 2 2 4 0 18 C-2 4 -4 2 -18 0 C-4 -2 -2 -4 0 -18 Z" fill="#f6c95b" />
            <circle r="24" fill="#f6c95b" opacity="0.18" />
          </g>
          {/* Skyline towers */}
          {[
            [14, 96, 36, 84],
            [56, 76, 42, 104],
            [106, 52, 46, 128],
            [160, 82, 38, 98],
            [206, 68, 44, 112],
            [258, 92, 46, 88],
          ].map(([x, y, w, h], idx) => (
            <g key={idx}>
              <rect x={x} y={y} width={w} height={h} rx="3" fill={idx === 2 ? '#16233d' : '#101a30'} stroke="#2d436e" strokeWidth="1.5" />
              {[0, 1, 2, 3].map((r) => (
                <rect
                  key={r}
                  x={x + 8}
                  y={y + 12 + r * 18}
                  width={w - 16}
                  height="5"
                  rx="2"
                  fill="#ead1a0"
                  opacity={(idx + r) % 2 === 0 ? 0.85 : 0.35}
                />
              ))}
            </g>
          ))}
          {isMonitor && (
            <text x="20" y="34" fill="#ead1a0" fontFamily={FONT_MONO} fontSize="11" letterSpacing="1.5" opacity="0.85">
              ACT 01 // PROLOGUE DUSK
            </text>
          )}
        </svg>
      );

    case 'clay':
      // Act 2 Draft: 白模停顿 — flat gray unrendered wireframe with loading spinner ("冗余停顿!")
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <rect width="320" height="180" fill="#b7b9bc" />
          <path d="M0 130 L320 130 M160 0 L160 180" stroke="#9aa0a6" strokeWidth="1.5" strokeDasharray="6 6" />
          <rect x="85" y="48" width="150" height="84" rx="8" fill="#cfd2d6" stroke="#7d838a" strokeWidth="2" />
          <g transform={`translate(160, 90) rotate(${t * 180})`}>
            <circle r="18" fill="none" stroke="#5f666e" strokeWidth="4" strokeDasharray="70 40" strokeLinecap="round" />
          </g>
          {isMonitor && (
            <text x="160" y="154" textAnchor="middle" fill="#444b52" fontFamily={FONT_SANS} fontSize="14" fontWeight="700">
              白模冗余停顿中...
            </text>
          )}
        </svg>
      );

    case 'space':
      // Act 2 Final: 商业空间成图 — warm golden architectural gallery + sculptural arch
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="spaceWall" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#26201a" />
              <stop offset="50%" stopColor="#463728" />
              <stop offset="100%" stopColor="#1b1612" />
            </linearGradient>
            <radialGradient id="spaceGlow" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#f6c95b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f6c95b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="320" height="180" fill="url(#spaceWall)" />
          <rect width="320" height="180" fill="url(#spaceGlow)" />
          <path d="M72 180 L72 78 A88 88 0 0 1 248 78 L248 180 Z" fill="#181410" stroke="#ead1a0" strokeWidth="2.5" />
          <path d="M104 180 L104 90 A56 56 0 0 1 216 90 L216 180 Z" fill="#2d241b" stroke="#ead1a0" strokeWidth="1.5" opacity="0.8" />
          {/* Travertine plinth & amber vessel */}
          <rect x="136" y="128" width="48" height="52" fill="#d7cab5" stroke="#2b2420" strokeWidth="1.5" />
          <ellipse cx="160" cy="112" rx="14" ry="18" fill="#de6e56" stroke="#f6c95b" strokeWidth="1.5" />
          {isMonitor && (
            <text x="20" y="34" fill="#ead1a0" fontFamily={FONT_MONO} fontSize="11" letterSpacing="1.5">
              ACT 02 // ASTRAARC DESIGN
            </text>
          )}
        </svg>
      );

    case 'matrix':
      // Act 3: IMAX 16屏动态作品矩阵 — glowing emerald & gold 4x3 screen wall
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <rect width="320" height="180" fill="#070c14" />
          {Array.from({ length: 12 }, (_, idx) => {
            const col = idx % 4;
            const row = Math.floor(idx / 4);
            const x = 18 + col * 73;
            const y = 26 + row * 46;
            const active = (idx + Math.floor(t * 4)) % 3 === 0;
            const colors = ['#34d399', '#ead1a0', '#58b4e8', '#de6e56'];
            const c = colors[idx % 4];
            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={y}
                  width="64"
                  height="38"
                  rx="5"
                  fill={active ? '#162936' : '#0f1826'}
                  stroke={active ? c : '#25364d'}
                  strokeWidth={active ? 2 : 1.2}
                />
                <rect x={x + 8} y={y + 10} width="26" height="5" rx="2" fill={c} opacity="0.85" />
                <rect x={x + 8} y={y + 20} width="44" height="4" rx="2" fill="#f8f2e7" opacity="0.35" />
              </g>
            );
          })}
          {isMonitor && (
            <text x="20" y="18" fill="#34d399" fontFamily={FONT_MONO} fontSize="10" letterSpacing="1.5">
              ACT 03 // IMAX 16-SCREEN MATRIX
            </text>
          )}
        </svg>
      );

    case 'prism':
      // Act 4: 光学棱镜神经折射 — crystalline prism splitting starlight beams
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <rect width="320" height="180" fill="#0b0f1e" />
          <line x1="0" y1="100" x2="145" y2="90" stroke="#f8f2e7" strokeWidth="3.5" opacity="0.9" />
          {[
            { y: 52, c: '#34d399' },
            { y: 78, c: '#58b4e8' },
            { y: 104, c: '#ead1a0' },
            { y: 130, c: '#de6e56' },
          ].map((beam, i) => (
            <line
              key={i}
              x1="175"
              y1="90"
              x2="320"
              y2={beam.y + Math.sin(t * 3 + i) * 6}
              stroke={beam.c}
              strokeWidth="4"
              opacity="0.85"
            />
          ))}
          <polygon
            points="160,34 112,134 208,134"
            fill="rgba(169, 153, 240, 0.22)"
            stroke="#ead1a0"
            strokeWidth="2.5"
          />
          {isMonitor && (
            <text x="20" y="30" fill="#a999f0" fontFamily={FONT_MONO} fontSize="11" letterSpacing="1.5">
              ACT 04 // NEURAL INTELLIGENCE
            </text>
          )}
        </svg>
      );

    case 'finale':
      // Act 5: 终幕光弧商业建筑 — radiant Polaris golden arc + AstraArc emblem
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="finGlow" cx="50%" cy="62%" r="60%">
              <stop offset="0%" stopColor="#f6c95b" stopOpacity="0.65" />
              <stop offset="55%" stopColor="#1b2640" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#05070b" />
            </radialGradient>
          </defs>
          <rect width="320" height="180" fill="url(#finGlow)" />
          <path
            d="M24 148 Q160 22 296 148"
            fill="none"
            stroke="#ead1a0"
            strokeWidth="3.5"
            opacity="0.95"
          />
          <path
            d="M52 154 Q160 54 268 154"
            fill="none"
            stroke="#34d399"
            strokeWidth="1.8"
            opacity="0.65"
          />
          <g transform={`translate(160, 78) scale(${1 + 0.08 * Math.sin(t * 5)})`}>
            <path d="M0 -24 C3 -6 6 -3 24 0 C6 3 3 6 0 24 C-3 6 -6 3 -24 0 C-6 -3 -3 -6 0 -24 Z" fill="#f6c95b" />
          </g>
          <text
            x="160"
            y="128"
            textAnchor="middle"
            fill="#f8f2e7"
            fontFamily={FONT_SANS}
            fontSize="16"
            fontWeight="800"
            letterSpacing="2"
          >
            ASTRAARC · 北迹星
          </text>
          {isMonitor && (
            <text
              x="160"
              y="148"
              textAnchor="middle"
              fill={COLORS.polarisGold}
              fontFamily={FONT_SANS}
              fontSize="10"
              opacity="0.9"
            >
              让更好的商业想象，真正发生
            </text>
          )}
        </svg>
      );
  }
};
