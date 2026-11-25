import React from 'react';
import { clamp, FONT_MONO, FONT_SANS, FONT_SERIF, UI } from '../theme';

export type CinemaSceneId = 'shift' | 'clay_morph' | 'matrix' | 'prism' | 'finale';

/**
 * Ultra-luxury live Cinema Preview playing inside OpenChatCut's "预览" Monitor.
 * Faithfully echoes the screenshot's "SHIFT / 商业世界正在发生深刻变化" editorial gold style,
 * plus live Clay->Final AI laser morph, 16-screen IMAX Matrix, Neural Prism, and Polaris Finale!
 */
export const CinemaPreview: React.FC<{
  scene: CinemaSceneId;
  t: number;
  morphProgress?: number; // 0 = clay wireframe, 1 = golden final
  subtitleZh?: string;
  subtitleEn?: string;
  subtitleError?: boolean;
  lutBoost?: number; // 0..1
  beatPulse?: number; // 0..1
  transitionFlash?: number; // 0..1
  showSafeFrame?: boolean;
}> = ({
  scene,
  t,
  morphProgress = 1,
  subtitleZh,
  subtitleEn,
  subtitleError = false,
  lutBoost = 0,
  beatPulse = 0,
  transitionFlash = 0,
  showSafeFrame = true,
}) => {
  const filter = `contrast(${1 + lutBoost * 0.16}) saturate(${1 + lutBoost * 0.25}) brightness(${1 + beatPulse * 0.12})`;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#050609',
        overflow: 'hidden',
        filter,
        fontFamily: FONT_SANS,
      }}
    >
      {/* Subtle animated starfield dust */}
      <svg width="100%" height="100%" viewBox="0 0 960 540" style={{ position: 'absolute', inset: 0, opacity: 0.45 }}>
        {Array.from({ length: 34 }, (_, i) => {
          const sx = (i * 97 + t * 8) % 960;
          const sy = (i * 53) % 540;
          const r = i % 4 === 0 ? 1.8 : 1;
          return <circle key={i} cx={sx} cy={sy} r={r} fill={i % 3 === 0 ? UI.gold : '#ffffff'} opacity={0.4 + 0.4 * Math.sin(t * 3 + i)} />;
        })}
      </svg>

      {/* SCENE 1: SHIFT (Directly echoing the exact frame in the user's OpenChatCut screenshot!) */}
      {scene === 'shift' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* Architectural dusk glow background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at 52% 45%, rgba(234, 209, 160, 0.18) 0%, rgba(20, 24, 38, 0.5) 45%, #050609 80%)',
            }}
          />
          {/* Subtle architectural skyline grid behind SHIFT */}
          <svg width="100%" height="100%" viewBox="0 0 960 540" style={{ position: 'absolute', inset: 0, opacity: 0.28 }}>
            <path d="M120 540 L260 110 L420 540 M480 540 L630 80 L790 540" stroke={UI.gold} strokeWidth="1" fill="none" />
            <line x1="120" y1="150" x2="840" y2="150" stroke={UI.gold} strokeWidth="0.8" opacity="0.5" />
            <line x1="120" y1="340" x2="840" y2="340" stroke={UI.gold} strokeWidth="0.8" opacity="0.5" />
          </svg>

          {/* Iconic Gold Serif SHIFT Title Lockup */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 38,
            }}
          >
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: 106,
                fontWeight: 600,
                letterSpacing: 18,
                color: UI.gold,
                textShadow: '0 8px 40px rgba(234, 209, 160, 0.32)',
                transform: `scale(${1 + beatPulse * 0.03})`,
              }}
            >
              SHIFT
            </div>
            <div
              style={{
                width: 440,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${UI.gold}aa, transparent)`,
                margin: '10px 0 16px',
              }}
            />
            <div
              style={{
                fontSize: 24,
                fontWeight: 500,
                letterSpacing: 6,
                color: '#f8f2e7',
                opacity: 0.92,
              }}
            >
              商业世界正在发生深刻变化
            </div>
          </div>

          {/* Bottom-right live PiP data dashboard (matching screenshot!) */}
          <div
            style={{
              position: 'absolute',
              right: 26,
              bottom: 62,
              width: 174,
              height: 104,
              borderRadius: 10,
              background: 'rgba(12, 14, 20, 0.92)',
              border: `1.5px solid ${UI.gold}66`,
              padding: 10,
              boxSizing: 'border-box',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: UI.gold, marginBottom: 6 }}>
              RADAR // MARKET SHIFT
            </div>
            <svg width="150" height="62" viewBox="0 0 150 62">
              <polyline
                fill="none"
                stroke={UI.emerald}
                strokeWidth="2"
                points={`0,52 25,44 50,47 78,28 108,32 145,${10 + Math.sin(t * 4) * 5}`}
              />
              <polyline
                fill="none"
                stroke={UI.exportOrange}
                strokeWidth="1.5"
                strokeDasharray="3 3"
                points="0,42 35,38 75,35 115,24 145,18"
              />
            </svg>
          </div>
        </div>
      )}

      {/* SCENE 2: AI VISION — LIVE CLAY WIREFRAME -> GOLDEN CINEMA MORPH */}
      {scene === 'clay_morph' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* Left side: Monochrome Clay Wireframe */}
          <svg viewBox="0 0 960 540" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <rect width="960" height="540" fill="#181a20" />
            <g stroke="#4b5563" strokeWidth="1.5" fill="none" opacity="0.7">
              <path d="M240 540 L240 210 A240 240 0 0 1 720 210 L720 540" />
              <path d="M320 540 L320 240 A160 160 0 0 1 640 240 L640 540" />
              <rect x="420" y="340" width="120" height="160" />
              <ellipse cx="480" cy="300" rx="34" ry="44" />
              {Array.from({ length: 12 }, (_, i) => (
                <line key={i} x1={i * 88} y1="0" x2={i * 88} y2="540" opacity="0.25" />
              ))}
            </g>
            <text x="36" y="54" fill="#9ca3af" fontFamily={FONT_MONO} fontSize="15">
              RAW CLAY // 商业空间白模
            </text>
          </svg>

          {/* Right/Clipped side: Rendered Golden Architectural Boutique */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `inset(0 ${(1 - clamp(morphProgress)) * 100}% 0 0)`,
            }}
          >
            <svg viewBox="0 0 960 540" width="100%" height="100%">
              <defs>
                <radialGradient id="boutiqueLight" cx="50%" cy="42%" r="58%">
                  <stop offset="0%" stopColor="#f6c95b" stopOpacity="0.48" />
                  <stop offset="55%" stopColor="#35281c" stopOpacity="0.92" />
                  <stop offset="100%" stopColor="#0a090c" />
                </radialGradient>
              </defs>
              <rect width="960" height="540" fill="url(#boutiqueLight)" />
              <path d="M240 540 L240 210 A240 240 0 0 1 720 210 L720 540 Z" fill="#171310" stroke={UI.gold} strokeWidth="3" />
              <path d="M320 540 L320 240 A160 160 0 0 1 640 240 L640 540 Z" fill="#2c2219" stroke={UI.gold} strokeWidth="2" opacity="0.85" />
              <rect x="420" y="340" width="120" height="160" fill="#dfd2bc" stroke="#524334" strokeWidth="2" />
              <ellipse cx="480" cy="300" rx="34" ry="44" fill="#de6e56" stroke={UI.goldBright} strokeWidth="2.5" />
              <text x="36" y="54" fill={UI.goldBright} fontFamily={FONT_MONO} fontSize="15" fontWeight="700">
                ✦ AI FINAL RENDER // ASTRAARC DESIGN
              </text>
            </svg>
          </div>

          {/* Glowing Laser Morph Scanline */}
          {morphProgress > 0.02 && morphProgress < 0.98 && (
            <div
              style={{
                position: 'absolute',
                left: `${morphProgress * 100}%`,
                top: 0,
                bottom: 0,
                width: 4,
                background: UI.violet,
                boxShadow: `0 0 24px 6px ${UI.violet}, 0 0 12px 2px #ffffff`,
              }}
            />
          )}
        </div>
      )}

      {/* SCENE 3: IMAX 16-SCREEN MOTION MATRIX */}
      {scene === 'matrix' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 45%, #111c2d 0%, #05070b 80%)',
            padding: '44px 58px 86px',
            boxSizing: 'border-box',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: 14,
            transform: `perspective(1000px) rotateX(6deg) scale(${1 + beatPulse * 0.04})`,
          }}
        >
          {[
            '01 北迹星全景',
            '02 NextLevel',
            '03 FinanceJob',
            '04 OntoGate',
            '05 商业沙盘',
            '06 品牌精工',
            '07 AI 机械臂',
            '08 光学镜头',
            '09 战略雷达',
            '10 价值流动',
            '11 硅基穹顶',
            '12 光弧终幕',
          ].map((label, i) => {
            const palette = [UI.goldBright, UI.emerald, UI.cyan, UI.magenta];
            const c = palette[i % 4];
            const hot = (i + Math.floor(t * 6)) % 4 === 0;
            return (
              <div
                key={label}
                style={{
                  borderRadius: 10,
                  background: hot ? 'rgba(26, 38, 56, 0.92)' : 'rgba(13, 18, 28, 0.85)',
                  border: `1.5px solid ${hot ? c : '#253147'}`,
                  boxShadow: hot ? `0 0 22px ${c}44` : undefined,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: c, fontWeight: 700 }}>
                    JSX #{String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: hot ? 1 : 0.35 }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f8f2e7' }}>{label}</div>
                <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${45 + ((i * 23 + Math.floor(t * 30)) % 55)}%`, background: c }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SCENE 4: NEURAL PRISM & INTELLIGENCE */}
      {scene === 'prism' && (
        <svg viewBox="0 0 960 540" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <rect width="960" height="540" fill="#060812" />
          <line x1="0" y1="290" x2="415" y2="260" stroke="#ffffff" strokeWidth="6" opacity="0.92" />
          {[
            { y: 120, c: UI.emerald },
            { y: 205, c: UI.cyan },
            { y: 290, c: UI.goldBright },
            { y: 375, c: UI.magenta },
          ].map((b, i) => (
            <line
              key={i}
              x1="540"
              y1="260"
              x2="960"
              y2={b.y + Math.sin(t * 5 + i) * 14}
              stroke={b.c}
              strokeWidth="8"
              opacity="0.88"
            />
          ))}
          <polygon
            points="480,95 350,375 610,375"
            fill="rgba(168, 85, 247, 0.16)"
            stroke={UI.gold}
            strokeWidth="3.5"
          />
          <text x="480" y="72" textAnchor="middle" fill={UI.gold} fontFamily={FONT_SERIF} fontSize="34" letterSpacing="10">
            INTELLIGENCE
          </text>
        </svg>
      )}

      {/* SCENE 5: ASTRAARC POLARIS FINALE */}
      {scene === 'finale' && (
        <svg viewBox="0 0 960 540" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <radialGradient id="polarisFinaleGlow" cx="50%" cy="56%" r="56%">
              <stop offset="0%" stopColor="#f6c95b" stopOpacity="0.45" />
              <stop offset="48%" stopColor="#1b2640" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#05060a" />
            </radialGradient>
          </defs>
          <rect width="960" height="540" fill="url(#polarisFinaleGlow)" />
          <path d="M80 420 Q480 80 880 420" fill="none" stroke={UI.gold} strokeWidth="3.5" opacity="0.95" />
          <path d="M160 440 Q480 150 800 440" fill="none" stroke={UI.emerald} strokeWidth="1.8" opacity="0.55" />
          <g transform={`translate(480, 210) scale(${1 + 0.08 * Math.sin(t * 5) + beatPulse * 0.1})`}>
            <path d="M0 -56 C7 -14 14 -7 56 0 C14 7 7 14 0 56 C-7 14 -14 7 -56 0 C-14 -7 -7 -14 0 -56 Z" fill={UI.goldBright} />
            <circle r="68" fill={UI.goldBright} opacity="0.12" />
          </g>
          <text x="480" y="330" textAnchor="middle" fill="#f8f2e7" fontFamily={FONT_SERIF} fontSize="54" fontWeight="700" letterSpacing="12">
            ASTRAARC
          </text>
          <text x="480" y="370" textAnchor="middle" fill={UI.gold} fontFamily={FONT_SANS} fontSize="22" letterSpacing="8">
            北迹星 · 让更好的商业想象真正发生
          </text>
        </svg>
      )}

      {/* Optional broadcast safe frame */}
      {showSafeFrame && (
        <div
          style={{
            position: 'absolute',
            inset: 18,
            border: '1px dashed rgba(234, 209, 160, 0.16)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Bilingual Bottom Subtitles (exact style of OpenChatCut screenshot) */}
      {subtitleZh && (
        <div
          style={{
            position: 'absolute',
            left: 36,
            right: 36,
            bottom: 18,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: subtitleError ? '4px 14px' : '2px 10px',
              borderRadius: 6,
              background: subtitleError ? 'rgba(239, 68, 68, 0.88)' : 'rgba(5, 6, 9, 0.62)',
              border: subtitleError ? '1.5px solid #fecaca' : 'none',
              color: '#ffffff',
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: 0.8,
              textShadow: '0 2px 8px rgba(0,0,0,0.9)',
            }}
          >
            {subtitleZh}
          </div>
          {subtitleEn && (
            <div
              style={{
                marginTop: 3,
                fontSize: 11,
                color: 'rgba(248, 242, 231, 0.72)',
                letterSpacing: 0.3,
              }}
            >
              {subtitleEn}
            </div>
          )}
        </div>
      )}

      {/* Transition Lens Flash */}
      {transitionFlash > 0.01 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle, rgba(246, 201, 91, ${transitionFlash * 0.75}), transparent 72%)`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
