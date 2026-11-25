import React from 'react';
import {
  ClipId,
  CLIPS,
  COLORS,
  FONT_MONO,
  FONT_SANS,
  TEXT_PRESETS,
  TRANSITIONS,
} from '../theme';
import { ClipArt } from './ClipArt';

export type LeftTab = 'assets' | 'transitions' | 'text';

export interface TimelineClipState {
  id: ClipId;
  x: number; // px within track area (0..1080)
  w: number;
  visible: boolean;
  opacity?: number;
  offsetY?: number;
  rotate?: number;
}

export interface GradeState {
  contrast: number; // 0..100 (default 20)
  saturation: number; // 0..200 (default 100)
  bassGlow: number; // 0..100 (default 0)
  speed: number; // 0.5..2.0 (default 1.0)
  overdrive?: boolean;
}

const panelBox: React.CSSProperties = {
  background: COLORS.paperCard,
  border: `2.4px solid ${COLORS.ink}`,
  borderRadius: 14,
  boxShadow: '3px 3px 0 rgba(43, 36, 32, 0.14)',
  boxSizing: 'border-box',
};

/** Top NLE Header Bar */
export const TopBar: React.FC<{
  timecode: string;
  exportState: 'idle' | 'rendering' | 'done';
  renderPct: number;
}> = ({ timecode, exportState, renderPct }) => (
  <div
    style={{
      position: 'absolute',
      left: 16,
      right: 16,
      top: 12,
      height: 44,
      ...panelBox,
      borderRadius: 11,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      fontFamily: FONT_SANS,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {['#f27970', '#f6c95b', '#62cf8b'].map((c) => (
          <span
            key={c}
            style={{
              width: 11,
              height: 11,
              borderRadius: '50%',
              background: c,
              border: `1.6px solid ${COLORS.ink}`,
              display: 'inline-block',
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.ink }}>
        ✦ 北极星 AI 剪辑 — AstraArc_Partners_v5.ccproj
      </span>
    </div>

    <div
      style={{
        background: COLORS.polarisNavy,
        color: COLORS.polarisGold,
        fontFamily: FONT_MONO,
        fontSize: 15,
        fontWeight: 700,
        padding: '4px 16px',
        borderRadius: 8,
        border: `2px solid ${COLORS.ink}`,
        letterSpacing: 1,
      }}
    >
      {timecode}
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 12, color: COLORS.inkSoft, fontWeight: 600 }}>
        OpenChatCut 已同步
      </span>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 12,
          fontWeight: 700,
          padding: '3px 9px',
          borderRadius: 6,
          border: `1.8px solid ${COLORS.ink}`,
          background: COLORS.paperSoft,
          color: COLORS.ink,
        }}
      >
        4K 60fps
      </span>
      <div
        style={{
          minWidth: 118,
          height: 28,
          borderRadius: 8,
          border: `2px solid ${COLORS.ink}`,
          background:
            exportState === 'done'
              ? '#4ade80'
              : exportState === 'rendering'
                ? '#fde047'
                : COLORS.polarisNavy,
          color: exportState === 'idle' ? COLORS.polarisGold : COLORS.ink,
          fontSize: 13,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 10px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {exportState === 'rendering' && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${renderPct}%`,
              background: 'rgba(246, 201, 91, 0.7)',
            }}
          />
        )}
        <span style={{ position: 'relative', zIndex: 1 }}>
          {exportState === 'done'
            ? '导出完成 ✓'
            : exportState === 'rendering'
              ? `渲染中 ${renderPct.toFixed(renderPct > 99 ? 2 : 0)}%`
              : '↑ 导出成片'}
        </span>
      </div>
    </div>
  </div>
);

/** Left Tabbed Asset / Transition / Text Panel */
export const LeftDock: React.FC<{
  activeTab: LeftTab;
  t: number;
  highlightIdx?: number;
}> = ({ activeTab, t, highlightIdx = -1 }) => {
  const assetOrder: ClipId[] = ['dusk', 'space', 'matrix', 'prism'];
  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        top: 68,
        width: 282,
        height: 312,
        ...panelBox,
        padding: 12,
        fontFamily: FONT_SANS,
      }}
    >
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {[
          { id: 'assets' as LeftTab, label: '素材' },
          { id: 'transitions' as LeftTab, label: '转场' },
          { id: 'text' as LeftTab, label: '文字' },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '4px 0',
                borderRadius: 8,
                border: `2px solid ${COLORS.ink}`,
                background: active ? COLORS.polarisGoldBright : COLORS.paperSoft,
                fontSize: 13,
                fontWeight: 800,
                color: COLORS.ink,
              }}
            >
              {tab.label}
            </div>
          );
        })}
      </div>

      {activeTab === 'assets' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          {assetOrder.map((cid, idx) => {
            const meta = CLIPS[cid];
            const hi = idx === highlightIdx;
            return (
              <div
                key={cid}
                style={{
                  border: `2px solid ${hi ? COLORS.polarisCoral : COLORS.ink}`,
                  borderRadius: 9,
                  overflow: 'hidden',
                  background: '#111622',
                  transform: hi ? 'scale(1.04)' : undefined,
                  boxShadow: hi ? '0 0 12px rgba(222,110,86,0.45)' : undefined,
                }}
              >
                <div style={{ height: 64, position: 'relative' }}>
                  <ClipArt id={cid} t={t} />
                  <span
                    style={{
                      position: 'absolute',
                      right: 4,
                      bottom: 4,
                      background: 'rgba(9,13,24,0.8)',
                      color: '#fff',
                      fontFamily: FONT_MONO,
                      fontSize: 10,
                      padding: '1px 4px',
                      borderRadius: 4,
                    }}
                  >
                    {meta.durationLabel}
                  </span>
                </div>
                <div
                  style={{
                    background: COLORS.paperCard,
                    padding: '3px 6px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: COLORS.ink,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {meta.shortName}
                </div>
              </div>
            );
          })}
          {/* Two extra folder badges from .ccproj */}
          {['05 旁白 (26)', '06 Suno交响'].map((folder) => (
            <div
              key={folder}
              style={{
                height: 46,
                border: `2px dashed ${COLORS.inkSoft}`,
                borderRadius: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: COLORS.inkSoft,
                background: COLORS.paperSoft,
              }}
            >
              + {folder}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'transitions' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          {TRANSITIONS.map((tr, idx) => (
            <div
              key={tr.id}
              style={{
                height: 74,
                borderRadius: 10,
                border: `2.2px solid ${idx === highlightIdx ? COLORS.polarisCoral : COLORS.ink}`,
                background: tr.bg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                transform: idx === highlightIdx ? 'scale(1.05)' : undefined,
              }}
            >
              <span style={{ fontSize: 22, color: COLORS.ink }}>{tr.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: COLORS.ink }}>
                {tr.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TEXT_PRESETS.map((tp, idx) => (
            <div
              key={tp.id}
              style={{
                height: 68,
                borderRadius: 10,
                border: `2.2px solid ${idx === highlightIdx ? COLORS.polarisCoral : COLORS.ink}`,
                background: tp.bg,
                color: tp.fg,
                padding: '8px 12px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 10, opacity: 0.75, fontWeight: 700 }}>
                {tp.tag}
              </span>
              <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: 0.5 }}>
                {tp.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/** Center Cinema Preview Monitor */
export const PreviewMonitor: React.FC<{
  activeClip: ClipId | null;
  t: number;
  grade: GradeState;
  subtitle?: string;
  subtitleTypo?: boolean;
  transitionFlash?: number; // 0..1
  beatPulse?: number; // 0..1
  showSocialOverlay?: boolean;
}> = ({
  activeClip,
  t,
  grade,
  subtitle,
  subtitleTypo = false,
  transitionFlash = 0,
  beatPulse = 0,
  showSocialOverlay = false,
}) => {
  const filterStr = `contrast(${0.92 + grade.contrast * 0.0045}) saturate(${grade.saturation / 100}) brightness(${1 + grade.bassGlow * 0.0018 + beatPulse * 0.1})`;
  return (
    <div
      style={{
        position: 'absolute',
        left: 332,
        top: 68,
        width: 590,
        height: 312,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: FONT_SANS,
      }}
    >
      {/* Sleek Cinema Bezel */}
      <div
        style={{
          width: 516,
          height: 278,
          borderRadius: 20,
          background: '#14171f',
          border: `3px solid ${COLORS.ink}`,
          padding: 10,
          boxSizing: 'border-box',
          boxShadow: '0 10px 26px rgba(27, 38, 64, 0.24)',
          transform: `scale(${1 + beatPulse * 0.024})`,
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 12,
            overflow: 'hidden',
            background: '#05070b',
            position: 'relative',
            filter: filterStr,
          }}
        >
          {activeClip ? (
            <ClipArt id={activeClip} t={t} isMonitor />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                placeItems: 'center',
                color: 'rgba(234,209,160,0.35)',
                fontFamily: FONT_MONO,
                fontSize: 13,
              }}
            >
              WAITING FOR TIMELINE...
            </div>
          )}

          {/* Overdrive rainbow/heat tint when saturation hits 爆表!! */}
          {grade.overdrive && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(120deg, rgba(255,60,120,0.28), rgba(246,201,91,0.25), rgba(52,211,153,0.25))',
                mixBlendMode: 'overlay',
              }}
            />
          )}

          {/* Transition flash */}
          {transitionFlash > 0.02 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle, rgba(246,201,91,${transitionFlash * 0.85}), transparent 72%)`,
              }}
            />
          )}

          {/* Live Subtitle Overlay */}
          {subtitle && (
            <div
              style={{
                position: 'absolute',
                left: 20,
                right: 20,
                bottom: 18,
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '5px 14px',
                  borderRadius: 8,
                  background: subtitleTypo
                    ? 'rgba(229, 72, 77, 0.92)'
                    : 'rgba(9, 13, 24, 0.84)',
                  border: `1.8px solid ${subtitleTypo ? '#fff' : COLORS.polarisGold}`,
                  color: subtitleTypo ? '#fff' : COLORS.polarisGoldBright,
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: 1,
                }}
              >
                {subtitle}
              </span>
            </div>
          )}

          {/* Final showcase telemetry pills */}
          {showSocialOverlay && (
            <div
              style={{
                position: 'absolute',
                right: 12,
                top: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                alignItems: 'flex-end',
              }}
            >
              {['5 幕成片', '26 轨旁白', 'IMAX -16 LUFS'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: 'rgba(9, 13, 24, 0.86)',
                    border: `1.4px solid ${COLORS.polarisGold}`,
                    color: COLORS.polarisGoldBright,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 999,
                  }}
                >
                  ✦ {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transport Controls */}
      <div
        style={{
          marginTop: 7,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          fontSize: 14,
          color: COLORS.ink,
          fontWeight: 800,
        }}
      >
        <span>⏮</span>
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: `2px solid ${COLORS.ink}`,
            background: COLORS.polarisGoldBright,
            display: 'grid',
            placeItems: 'center',
            fontSize: 11,
          }}
        >
          ▶
        </span>
        <span>⏭</span>
      </div>
    </div>
  );
};

/** Right Inspector Panel ("智能调色 ✨") */
export const RightInspector: React.FC<{ grade: GradeState }> = ({ grade }) => {
  const rows = [
    {
      label: '电影对比度',
      val: `${Math.round(grade.contrast)}%`,
      pct: grade.contrast / 100,
      color: COLORS.polarisGoldBright,
    },
    {
      label: '星辉饱和度',
      val: grade.overdrive ? '爆表!!' : `${Math.round(grade.saturation)}%`,
      pct: Math.min(1, grade.saturation / 160),
      color: grade.overdrive ? COLORS.playheadRed : COLORS.polarisEmerald,
      hot: grade.overdrive,
    },
    {
      label: 'IMAX 低频',
      val: `${Math.round(grade.bassGlow)}%`,
      pct: grade.bassGlow / 100,
      color: COLORS.polarisSky,
    },
    {
      label: '镜头速度',
      val: `${grade.speed.toFixed(1)}x`,
      pct: (grade.speed - 0.5) / 1.5,
      color: COLORS.polarisLavender,
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        right: 16,
        top: 68,
        width: 318,
        height: 312,
        ...panelBox,
        padding: '14px 16px',
        fontFamily: FONT_SANS,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 900,
          color: COLORS.ink,
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>智能调色 ✨</span>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: COLORS.polarisNavy,
            background: COLORS.polarisGold,
            padding: '2px 8px',
            borderRadius: 6,
            border: `1.5px solid ${COLORS.ink}`,
          }}
        >
          LUT: POLARIS
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {rows.map((r) => (
          <div key={r.label}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.ink,
                marginBottom: 6,
              }}
            >
              <span>{r.label}</span>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  color: r.hot ? COLORS.playheadRed : COLORS.ink,
                  fontWeight: 800,
                }}
              >
                {r.val}
              </span>
            </div>
            <div
              style={{
                height: 10,
                borderRadius: 999,
                background: COLORS.paperSoft,
                border: `1.8px solid ${COLORS.ink}`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${Math.max(4, r.pct * 100)}%`,
                  borderRadius: 999,
                  background: r.color,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: `calc(${r.pct * 100}% - 9px)`,
                  top: -5,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: r.hot ? COLORS.playheadRed : '#fffdf8',
                  border: `2.2px solid ${COLORS.ink}`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Bottom Multi-Track Timeline Dock (T / Video / Suno Audio + Beat Markers) */
export const TimelineDock: React.FC<{
  clips: TimelineClipState[];
  transitionsPlaced: number; // 0..4
  subtitleClipVisible: boolean;
  subtitleText: string;
  audioWidthPct: number; // 0..1
  beatSyncProgress: number; // 0..1
  playheadX: number; // 0..1120
  t: number;
}> = ({
  clips,
  transitionsPlaced,
  subtitleClipVisible,
  subtitleText,
  audioWidthPct,
  beatSyncProgress,
  playheadX,
  t,
}) => {
  const trackLeft = 86;
  const trackW = 1136;

  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        top: 392,
        bottom: 14,
        ...panelBox,
        padding: '10px 14px',
        fontFamily: FONT_SANS,
        overflow: 'hidden',
      }}
    >
      {/* Time ruler */}
      <div
        style={{
          marginLeft: trackLeft - 14,
          height: 22,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: FONT_MONO,
          fontSize: 11,
          color: COLORS.inkSoft,
          borderBottom: `1.5px solid rgba(43,36,32,0.18)`,
          paddingBottom: 4,
        }}
      >
        {['00:00', '00:04', '00:08', '00:12', '00:16', '00:20', '00:24', '00:28'].map(
          (mk) => (
            <span key={mk}>{mk}</span>
          )
        )}
      </div>

      {/* Track Labels (T, Video, Audio) */}
      {[
        { top: 44, icon: 'T', bg: '#fef3c7' },
        { top: 96, icon: '▶', bg: '#e0f2fe' },
        { top: 186, icon: '♪', bg: '#dcfce7' },
      ].map((tr) => (
        <div
          key={tr.icon}
          style={{
            position: 'absolute',
            left: 18,
            top: tr.top,
            width: 42,
            height: 38,
            borderRadius: 9,
            border: `2px solid ${COLORS.ink}`,
            background: tr.bg,
            display: 'grid',
            placeItems: 'center',
            fontWeight: 900,
            fontSize: 16,
            color: COLORS.ink,
          }}
        >
          {tr.icon}
        </div>
      ))}

      {/* Track 1: Subtitle / Caption Track */}
      <div
        style={{
          position: 'absolute',
          left: trackLeft,
          top: 44,
          width: trackW,
          height: 38,
          borderRadius: 8,
          background: 'rgba(239, 233, 220, 0.55)',
          border: '1.5px dashed rgba(43, 36, 32, 0.16)',
        }}
      >
        {subtitleClipVisible && (
          <div
            style={{
              position: 'absolute',
              left: 230,
              top: 3,
              width: 470,
              height: 30,
              borderRadius: 7,
              background: COLORS.polarisGoldBright,
              border: `2px solid ${COLORS.ink}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              fontSize: 13,
              fontWeight: 800,
              color: COLORS.ink,
              boxShadow: '2px 2px 0 rgba(43,36,32,0.18)',
            }}
          >
            T · {subtitleText}
          </div>
        )}
      </div>

      {/* Track 2: Video Clips Track */}
      <div
        style={{
          position: 'absolute',
          left: trackLeft,
          top: 94,
          width: trackW,
          height: 78,
          borderRadius: 10,
          background: 'rgba(239, 233, 220, 0.65)',
          border: '1.5px solid rgba(43, 36, 32, 0.14)',
        }}
      >
        {clips.map(
          (clip) =>
            clip.visible && (
              <div
                key={clip.id}
                style={{
                  position: 'absolute',
                  left: clip.x,
                  top: 4 + (clip.offsetY || 0),
                  width: clip.w,
                  height: 68,
                  borderRadius: 9,
                  overflow: 'hidden',
                  border: `2.4px solid ${COLORS.ink}`,
                  opacity: clip.opacity ?? 1,
                  transform: clip.rotate ? `rotate(${clip.rotate}deg)` : undefined,
                  background: '#111622',
                }}
              >
                <ClipArt id={clip.id} t={t} />
                <div
                  style={{
                    position: 'absolute',
                    left: 6,
                    top: 5,
                    background: 'rgba(9, 13, 24, 0.82)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 5,
                  }}
                >
                  {CLIPS[clip.id].shortName}
                </div>
              </div>
            )
        )}

        {/* Placed Transition Badges at Cut Boundaries */}
        {[200, 410, 630, 840].map((cx, idx) =>
          idx < transitionsPlaced ? (
            <div
              key={cx}
              style={{
                position: 'absolute',
                left: cx - 15,
                top: 23,
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: COLORS.polarisGoldBright,
                border: `2.2px solid ${COLORS.ink}`,
                display: 'grid',
                placeItems: 'center',
                fontSize: 14,
                fontWeight: 900,
                color: COLORS.ink,
                boxShadow: '0 0 12px rgba(246, 201, 91, 0.75)',
                zIndex: 5,
              }}
            >
              ✦
            </div>
          ) : null
        )}
      </div>

      {/* Track 3: Suno Symphony Audio Waveform Track */}
      <div
        style={{
          position: 'absolute',
          left: trackLeft,
          top: 184,
          width: trackW,
          height: 44,
          borderRadius: 9,
          background: 'rgba(239, 233, 220, 0.55)',
          border: '1.5px solid rgba(43, 36, 32, 0.14)',
          overflow: 'hidden',
        }}
      >
        {audioWidthPct > 0.01 && (
          <div
            style={{
              width: `${audioWidthPct * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #dbeafe, #ede9fe, #dcfce7)',
              borderRight: `2.2px solid ${COLORS.ink}`,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              padding: '0 10px',
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 8,
                top: 3,
                fontSize: 10,
                fontFamily: FONT_MONO,
                fontWeight: 700,
                color: COLORS.polarisNavy,
              }}
            >
              ♪ Suno 史诗交响原声 (210s) + VO S01–S26
            </span>
            {Array.from({ length: 82 }, (_, i) => {
              const h = 8 + 20 * Math.abs(Math.sin(i * 0.65 + 1.2) * Math.cos(i * 0.23));
              return (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: h,
                    marginTop: 12,
                    borderRadius: 2,
                    background:
                      beatSyncProgress > 0 && i % 6 === 0
                        ? COLORS.polarisCoral
                        : '#6b7db3',
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Cascading Golden Beat-Sync Markers */}
      <div
        style={{
          position: 'absolute',
          left: trackLeft,
          top: 234,
          width: trackW - 110,
          height: 22,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {Array.from({ length: 28 }, (_, i) => {
          const threshold = i / 28;
          const active = beatSyncProgress > threshold;
          return (
            <span
              key={i}
              style={{
                fontSize: 13,
                color: active ? COLORS.polarisGoldBright : 'transparent',
                textShadow: active ? `0 0 1px ${COLORS.ink}` : undefined,
                WebkitTextStroke: active ? `1px ${COLORS.ink}` : undefined,
                transform: active ? 'scale(1)' : 'scale(0.2)',
              }}
            >
              ▼
            </span>
          );
        })}
      </div>

      {/* Bottom Right AI Beat-Sync Button */}
      <div
        style={{
          position: 'absolute',
          right: 18,
          bottom: 14,
          padding: '4px 14px',
          borderRadius: 8,
          border: `2px solid ${COLORS.ink}`,
          background: beatSyncProgress > 0.05 ? COLORS.polarisGoldBright : COLORS.paperSoft,
          fontSize: 13,
          fontWeight: 800,
          color: COLORS.ink,
        }}
      >
        ▼ AI 卡点
      </div>

      {/* Playhead Line */}
      <div
        style={{
          position: 'absolute',
          left: trackLeft + playheadX,
          top: 24,
          bottom: 16,
          width: 2.5,
          background: COLORS.playheadRed,
          zIndex: 12,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -7,
            top: -4,
            width: 16,
            height: 14,
            borderRadius: '3px 3px 8px 8px',
            background: COLORS.playheadRed,
            border: `1.8px solid ${COLORS.ink}`,
          }}
        />
      </div>
    </div>
  );
};
