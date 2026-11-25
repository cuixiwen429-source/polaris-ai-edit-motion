import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  clamp,
  ClipId,
  COLORS,
  DURATION_IN_FRAMES,
  ease,
  easeOutBack,
  FONT_MONO,
  FONT_SANS,
  FPS,
  lerp,
  spring,
} from './theme';
import {
  GradeState,
  LeftDock,
  LeftTab,
  PreviewMonitor,
  RightInspector,
  TimelineClipState,
  TimelineDock,
  TopBar,
} from './components/EditorPanels';
import { ArmTarget, BotMood, PolarisBot } from './components/PolarisBot';

export { FPS, DURATION_IN_FRAMES };

const formatTimecode = (sec: number) => {
  const s = Math.max(0, sec);
  const mins = Math.floor(s / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(s % 60)
    .toString()
    .padStart(2, '0');
  const frames = Math.floor((s % 1) * FPS)
    .toString()
    .padStart(2, '0');
  return `00:${mins}:${secs}:${frames}`;
};

/**
 * Beat 1 (0.0s – 1.5s): Warm paper opening code window booting the Polaris AI Editor
 */
const BootTerminal: React.FC<{ t: number }> = ({ t }) => {
  const line1 = 'const 剪辑引擎 = 北极星AI.一键成片("AstraArc_Native_v5.ccproj")';
  const line2 = '剪辑引擎.装载(时间轴, 预览窗, 调色与混音面板)';
  const p1 = clamp(t / 0.65);
  const p2 = clamp((t - 0.55) / 0.55);
  const exit = ease((t - 1.2) / 0.3);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.paper,
        display: 'grid',
        placeItems: 'center',
        fontFamily: FONT_MONO,
      }}
    >
      <div
        style={{
          width: 780,
          borderRadius: 16,
          background: COLORS.paperCard,
          border: `2.8px solid ${COLORS.ink}`,
          boxShadow: '8px 8px 0 rgba(27, 38, 64, 0.14)',
          overflow: 'hidden',
          transform: `scale(${(0.86 + 0.14 * spring(t)) * (1 + exit * 0.22)})`,
          opacity: 1 - exit,
        }}
      >
        <div
          style={{
            height: 36,
            borderBottom: `2.2px solid ${COLORS.ink}`,
            background: COLORS.paperSoft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 14px',
          }}
        >
          <div style={{ display: 'flex', gap: 7 }}>
            {['#f27970', '#f6c95b', '#62cf8b'].map((c) => (
              <span
                key={c}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: '50%',
                  background: c,
                  border: `1.5px solid ${COLORS.ink}`,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.inkSoft }}>
            北极星 AI 剪辑 · OpenChatCut
          </span>
          <span style={{ width: 42 }} />
        </div>
        <div style={{ padding: '26px 28px', fontSize: 21, lineHeight: 1.9, color: COLORS.ink }}>
          <div>
            <span style={{ color: '#9c9286', marginRight: 18 }}>1</span>
            <span style={{ color: '#4f46e5', fontWeight: 700 }}>
              {line1.slice(0, Math.floor(p1 * line1.length))}
            </span>
          </div>
          <div>
            <span style={{ color: '#9c9286', marginRight: 18 }}>2</span>
            <span style={{ color: COLORS.polarisNavy, fontWeight: 700 }}>
              {line2.slice(0, Math.floor(p2 * line2.length))}
            </span>
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 22,
                background: COLORS.polarisCoral,
                marginLeft: 4,
                verticalAlign: 'middle',
                opacity: Math.sin(t * 16) > 0 ? 1 : 0,
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Master 30-second (900 frames @ 30fps) Polaris AI Editing Motion Film
 */
export const PolarisEditFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // Beat 1: Opening Code Boot (0.0s – 1.5s)
  if (t < 1.48) {
    return <BootTerminal t={t} />;
  }

  // Editor entrance pop
  const uiEnter = ease((t - 1.48) / 0.38);

  // Determine Left Tab
  let activeTab: LeftTab = 'assets';
  if (t >= 7.8 && t < 11.2) activeTab = 'transitions';
  else if (t >= 11.2) activeTab = 'text';

  // Ripple delete timing for the clay bad-take clip (5.2s – 7.8s)
  const trashThrow = ease((t - 6.35) / 0.65);
  const rippleClose = ease((t - 6.95) / 0.55);

  // Video clips appearing in rapid succession during Beat 2 (1.8s – 4.6s)
  const clayWidth = 140;
  const shiftAfterClay = (1 - rippleClose) * clayWidth;

  const clips: TimelineClipState[] = [
    {
      id: 'dusk',
      x: 10,
      w: 190,
      visible: t >= 2.0,
    },
    {
      id: 'clay',
      x: 204 + trashThrow * 180,
      w: clayWidth - 4,
      visible: t >= 2.55 && trashThrow < 0.98,
      offsetY: -Math.sin(trashThrow * Math.PI) * 95 + trashThrow * 120,
      rotate: trashThrow * 38,
      opacity: 1 - trashThrow,
    },
    {
      id: 'space',
      x: 204 + shiftAfterClay,
      w: 206,
      visible: t >= 3.05,
    },
    {
      id: 'matrix',
      x: 414 + shiftAfterClay,
      w: 216,
      visible: t >= 3.55,
    },
    {
      id: 'prism',
      x: 634 + shiftAfterClay,
      w: 206,
      visible: t >= 4.0,
    },
    {
      id: 'finale',
      x: 844 + shiftAfterClay,
      w: 220,
      visible: t >= 4.4,
    },
  ];

  // Audio waveform rollout (3.8s – 4.9s)
  const audioWidthPct = ease((t - 3.75) / 1.15);

  // Transitions thrown (7.8s – 11.2s)
  const transitionsPlaced =
    t < 8.4 ? 0 : t < 9.1 ? 1 : t < 9.8 ? 2 : t < 10.5 ? 3 : 4;
  const activeThrowIdx =
    t >= 8.0 && t < 10.6 ? Math.floor((t - 8.0) / 0.65) : -1;
  const throwLocal = activeThrowIdx >= 0 ? ((t - 8.0) % 0.65) / 0.65 : 0;

  // Subtitle track & Ctrl+Z self-correction (11.2s – 15.2s)
  const subtitleClipVisible = t >= 12.1;
  const isTypoPhase = t >= 12.1 && t < 13.75;
  const subtitleText = isTypoPhase
    ? '让更好的商业想象发声 (错字!)'
    : '让更好的商业想象，真正发生';
  const showCtrlZ = t >= 13.2 && t < 14.35;
  const showFixedStamp = t >= 13.85 && t < 15.15;

  // Color Grading Sliders (15.2s – 19.6s)
  const grade: GradeState = {
    contrast: 22 + 54 * ease((t - 15.4) / 0.9),
    saturation:
      t < 16.2
        ? 100
        : t < 17.5
          ? lerp(100, 175, ease((t - 16.2) / 0.95))
          : lerp(175, 118, ease((t - 17.5) / 0.8)),
    bassGlow: 82 * ease((t - 18.2) / 0.95),
    speed: 1.0 + 0.2 * ease((t - 18.8) / 0.6),
    overdrive: t >= 16.95 && t < 17.65,
  };

  // Beat-Sync Cascade (19.6s – 23.6s)
  const beatSyncProgress = ease((t - 20.4) / 1.9);
  const beatPulse =
    beatSyncProgress > 0.15 && t < 26.8
      ? Math.pow(Math.max(0, Math.sin(t * Math.PI * 4)), 6)
      : 0;

  // Export & Render Progress (23.6s – 26.8s)
  let exportState: 'idle' | 'rendering' | 'done' = 'idle';
  let renderPct = 0;
  if (t >= 24.0 && t < 26.1) {
    exportState = 'rendering';
    renderPct =
      t < 25.2
        ? lerp(0, 99.99, ease((t - 24.0) / 1.2))
        : 99.99; // classic 0.9s 99.99% suspense!
  } else if (t >= 26.1) {
    exportState = 'done';
    renderPct = 100;
  }

  // Playhead motion across the timeline
  let playheadX = 20;
  if (t < 5.2) playheadX = lerp(20, 220, ease((t - 2.0) / 3.2));
  else if (t < 7.8) playheadX = 265; // inspecting clay clip
  else if (t < 11.2) playheadX = lerp(210, 620, ease((t - 7.8) / 3.4));
  else if (t < 15.2) playheadX = lerp(320, 480, ease((t - 11.2) / 4.0));
  else if (t < 19.6) playheadX = lerp(480, 740, ease((t - 15.2) / 4.4));
  else if (t < 26.8) playheadX = lerp(120, 1020, (t - 19.6) / 7.2);
  else playheadX = lerp(20, 1040, (t - 26.8) / 3.2);

  // Determine Active Preview Clip based on playhead
  let activeClip: ClipId | null = null;
  if (t >= 2.0 && t < 5.2) activeClip = t < 3.2 ? 'dusk' : t < 4.2 ? 'space' : 'matrix';
  else if (t >= 5.2 && t < 6.7) activeClip = 'clay';
  else if (t >= 6.7 && t < 9.2) activeClip = 'space';
  else if (t >= 9.2 && t < 11.2) activeClip = 'matrix';
  else if (t >= 11.2 && t < 15.2) activeClip = 'prism';
  else if (t >= 15.2 && t < 20.0) activeClip = 'space';
  else if (t >= 20.0 && t < 24.0) activeClip = Math.floor(t * 2) % 2 === 0 ? 'matrix' : 'prism';
  else if (t >= 24.0) activeClip = 'finale';

  const transitionFlash =
    activeThrowIdx >= 0 && throwLocal > 0.78 ? (1 - throwLocal) * 4 : 0;

  // Dynamic Camera Zooms (matching reference's playful focus zooms!)
  let camScale = 1;
  let camX = 0;
  let camY = 0;
  if (t >= 15.2 && t < 19.6) {
    // Zoom into Right Inspector + Monitor during Color Grading
    const z = ease((t - 15.2) / 0.45) * (1 - ease((t - 19.15) / 0.45));
    camScale = 1 + 0.2 * z;
    camX = -110 * z;
    camY = 36 * z;
  } else if (t >= 23.8 && t < 26.2) {
    // Subtle zoom toward top-right Export button
    const z = ease((t - 23.8) / 0.4) * (1 - ease((t - 25.8) / 0.4));
    camScale = 1 + 0.14 * z;
    camX = -75 * z;
    camY = 48 * z;
  }

  // Mascot Choreography (position, mood, stretchy arms, speech bubbles)
  let botX = 210;
  let botY = 468;
  let mood: BotMood = 'happy';
  let leftArm: ArmTarget | undefined;
  let rightArm: ArmTarget | undefined;
  let speech: string | undefined;
  let speechSide: 'top' | 'right' | 'left' = 'top';

  if (t < 5.2) {
    botX = lerp(190, 440, ease((t - 1.8) / 3.2));
    botY = 462;
    mood = 'focused';
    if (t < 2.9) speech = '开工!';
    const grabCycle = (t * 2.1) % 1;
    leftArm = {
      x: lerp(130, botX + 60, ease(grabCycle)),
      y: lerp(170, 515, ease(grabCycle)),
      grabbing: grabCycle < 0.65,
    };
  } else if (t < 7.8) {
    botX = 230;
    botY = 462;
    mood = t > 6.2 ? 'focused' : 'shocked';
    if (t < 6.25) {
      speech = '这段白模在发呆!';
      speechSide = 'right';
    }
    rightArm = {
      x: lerp(340, 490, trashThrow),
      y: lerp(515, 455, Math.sin(trashThrow * Math.PI)),
      grabbing: trashThrow < 0.7,
    };
  } else if (t < 11.2) {
    botX = 330;
    botY = 462;
    mood = 'proud';
    if (activeThrowIdx >= 0) {
      const targetXs = [302, 512, 732, 942];
      const tx = targetXs[Math.min(3, activeThrowIdx)];
      leftArm = {
        x: lerp(150, tx, ease(throwLocal)),
        y: lerp(180, 515, ease(throwLocal)),
        grabbing: throwLocal < 0.5,
      };
    }
  } else if (t < 15.2) {
    botX = 260;
    botY = 462;
    mood = isTypoPhase ? 'shocked' : 'proud';
    if (showCtrlZ) {
      speech = '瞬时撤销!';
      speechSide = 'right';
    }
    rightArm = { x: 350, y: 465, grabbing: showCtrlZ };
  } else if (t < 19.6) {
    botX = 340;
    botY = 585;
    mood = grade.overdrive ? 'shocked' : 'focused';
    // Reach across the entire screen to drag the Right Inspector sliders!
    const sliderY = t < 16.2 ? 154 : t < 18.2 ? 214 : 274;
    const sliderX =
      t < 16.2
        ? lerp(1010, 1180, ease((t - 15.4) / 0.8))
        : t < 17.5
          ? lerp(1110, 1235, ease((t - 16.2) / 0.95))
          : t < 18.2
            ? lerp(1235, 1150, ease((t - 17.5) / 0.6))
            : lerp(985, 1190, ease((t - 18.2) / 0.9));
    rightArm = { x: sliderX, y: sliderY, grabbing: true };
  } else if (t < 23.6) {
    botX = lerp(480, 840, ease((t - 19.6) / 2.2));
    botY = 560;
    mood = 'cheer';
    if (t >= 20.0 && t < 21.8) {
      rightArm = { x: 1185, y: 678, grabbing: true };
    }
  } else if (t < 26.8) {
    botX = 835;
    botY = 520;
    mood = exportState === 'done' ? 'cheer' : renderPct > 99 ? 'sweat' : 'focused';
    if (t < 24.6) {
      rightArm = { x: 1190, y: 34, grabbing: true };
    } else if (renderPct > 99 && exportState === 'rendering') {
      speech = '...';
      speechSide = 'top';
    }
  } else {
    // Final celebration beside the sticky note & showcase monitor
    botX = 1015;
    botY = 535;
    mood = 'cheer';
    rightArm = { x: 1068, y: 472, grabbing: false };
  }

  // Final showcase fade of background editor (26.8s – 30.0s)
  const finaleFade = ease((t - 26.8) / 0.55);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.paper,
        overflow: 'hidden',
        fontFamily: FONT_SANS,
      }}
    >
      {/* Main NLE Stage with dynamic camera zoom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${uiEnter * camScale}) translate(${camX}px, ${camY}px)`,
          transformOrigin: '50% 50%',
          opacity: 1 - finaleFade * 0.65,
        }}
      >
        <TopBar
          timecode={formatTimecode(t)}
          exportState={exportState}
          renderPct={renderPct}
        />
        <LeftDock
          activeTab={activeTab}
          t={t}
          highlightIdx={activeThrowIdx >= 0 ? activeThrowIdx % 6 : -1}
        />
        <PreviewMonitor
          activeClip={activeClip}
          t={t}
          grade={grade}
          subtitle={subtitleClipVisible ? subtitleText : undefined}
          subtitleTypo={isTypoPhase}
          transitionFlash={transitionFlash}
          beatPulse={beatPulse}
          showSocialOverlay={t >= 26.8}
        />
        <RightInspector grade={grade} />
        <TimelineDock
          clips={clips}
          transitionsPlaced={transitionsPlaced}
          subtitleClipVisible={subtitleClipVisible}
          subtitleText={subtitleText}
          audioWidthPct={audioWidthPct}
          beatSyncProgress={beatSyncProgress}
          playheadX={playheadX}
          t={t}
        />

        {/* Trash Can during Beat 3 (6.2s – 7.6s) */}
        {t >= 6.2 && t < 7.6 && (
          <div
            style={{
              position: 'absolute',
              left: 525,
              top: 560,
              width: 74,
              height: 88,
              borderRadius: '6px 6px 14px 14px',
              background: '#d6d3cb',
              border: `2.6px solid ${COLORS.ink}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${easeOutBack((t - 6.2) / 0.25)})`,
              zIndex: 20,
            }}
          >
            <span style={{ fontSize: 32 }}>🗑️</span>
            {t >= 6.85 && (
              <span
                style={{
                  position: 'absolute',
                  right: -86,
                  bottom: 10,
                  fontSize: 28,
                  fontWeight: 900,
                  color: COLORS.polarisGoldBright,
                  WebkitTextStroke: `1.5px ${COLORS.ink}`,
                }}
              >
                哐当!
              </span>
            )}
          </div>
        )}

        {/* Comic Callout: 唰! */}
        {t >= 6.35 && t < 7.1 && (
          <div
            style={{
              position: 'absolute',
              left: 610,
              top: 405,
              fontSize: 34,
              fontWeight: 900,
              color: COLORS.polarisCoral,
              WebkitTextStroke: `1.6px ${COLORS.ink}`,
              transform: `rotate(-10deg) scale(${spring(t - 6.35)})`,
              zIndex: 22,
            }}
          >
            唰!
          </div>
        )}

        {/* Comic Callout: 空心入网! */}
        {t >= 9.0 && t < 10.6 && (
          <div
            style={{
              position: 'absolute',
              left: 445,
              top: 398,
              fontSize: 30,
              fontWeight: 900,
              color: COLORS.polarisGoldBright,
              WebkitTextStroke: `1.5px ${COLORS.ink}`,
              transform: `rotate(-6deg) scale(${spring(t - 9.0)})`,
              zIndex: 22,
            }}
          >
            空心入网!
          </div>
        )}

        {/* Giant Keycap: Ctrl+Z */}
        {showCtrlZ && (
          <div
            style={{
              position: 'absolute',
              left: 200,
              top: 520,
              padding: '14px 28px',
              borderRadius: 14,
              background: '#fffdf8',
              border: `3px solid ${COLORS.ink}`,
              boxShadow: `0 8px 0 ${COLORS.ink}`,
              fontFamily: FONT_MONO,
              fontSize: 34,
              fontWeight: 900,
              color: COLORS.ink,
              transform: `scale(${spring(t - 13.2)})`,
              zIndex: 24,
            }}
          >
            Ctrl + Z
          </div>
        )}

        {/* Green Ink Seal: 已修正 */}
        {showFixedStamp && (
          <div
            style={{
              position: 'absolute',
              left: 775,
              top: 170,
              padding: '8px 22px',
              border: '4px solid #22a06b',
              borderRadius: 10,
              color: '#22a06b',
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: 3,
              background: 'rgba(255, 253, 248, 0.88)',
              transform: `rotate(-9deg) scale(${spring(t - 13.85)})`,
              zIndex: 25,
            }}
          >
            已修正 ✓
          </div>
        )}

        {/* Comic Callout: 饱和度:拉满 */}
        {grade.overdrive && (
          <div
            style={{
              position: 'absolute',
              left: 560,
              top: 105,
              fontSize: 32,
              fontWeight: 900,
              color: COLORS.polarisGoldBright,
              WebkitTextStroke: `1.8px ${COLORS.ink}`,
              transform: `scale(${spring(t - 16.95)})`,
              zIndex: 25,
            }}
          >
            饱和度：拉满!!
          </div>
        )}

        {/* Comic Callout: 卡点! */}
        {t >= 20.7 && t < 22.4 && (
          <div
            style={{
              position: 'absolute',
              left: 225,
              top: 565,
              fontSize: 34,
              fontWeight: 900,
              color: COLORS.polarisGoldBright,
              WebkitTextStroke: `1.6px ${COLORS.ink}`,
              transform: `rotate(-8deg) scale(${spring(t - 20.7)})`,
              zIndex: 25,
            }}
          >
            AI 卡点!
          </div>
        )}

        {/* Comic Callout: 叮! */}
        {t >= 26.1 && t < 26.85 && (
          <div
            style={{
              position: 'absolute',
              left: 880,
              top: 76,
              fontSize: 40,
              fontWeight: 900,
              color: '#4ade80',
              WebkitTextStroke: `1.8px ${COLORS.ink}`,
              transform: `rotate(8deg) scale(${spring(t - 26.1)})`,
              zIndex: 26,
            }}
          >
            叮!
          </div>
        )}

        {/* Mascot inside NLE (before finale fade) */}
        {t < 26.8 && (
          <PolarisBot
            x={botX}
            y={botY}
            t={t}
            mood={mood}
            leftArm={leftArm}
            rightArm={rightArm}
            speech={speech}
            speechSide={speechSide}
          />
        )}
      </div>

      {/* Beat 9 (26.8s – 30.0s): Finale Showcase Monitor + Hand-drawn Sticky Note + Cheering Mascot */}
      {t >= 26.8 && (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          {/* Elevated Showcase Monitor */}
          <div
            style={{
              position: 'absolute',
              left: 465,
              top: 112,
              transform: `scale(${1.08 + 0.04 * spring(t - 26.8)})`,
            }}
          >
            <div style={{ position: 'relative', left: -332, top: -68 }}>
              <PreviewMonitor
                activeClip="finale"
                t={t}
                grade={grade}
                subtitle="让更好的商业想象，真正发生"
                showSocialOverlay
              />
            </div>
          </div>

          {/* Hand-drawn Cream Sticky Note */}
          <div
            style={{
              position: 'absolute',
              left: 62,
              top: 158,
              width: 348,
              height: 316,
              borderRadius: 16,
              background: '#fffdf4',
              border: `3px solid ${COLORS.ink}`,
              boxShadow: '10px 10px 0 rgba(27, 38, 64, 0.16)',
              padding: '34px 28px',
              boxSizing: 'border-box',
              transform: `rotate(-3deg) scale(${spring(t - 26.9)})`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Tape strip */}
            <div
              style={{
                position: 'absolute',
                left: 122,
                top: -14,
                width: 104,
                height: 26,
                background: 'rgba(234, 209, 160, 0.85)',
                border: `2px solid ${COLORS.ink}`,
                borderRadius: 4,
              }}
            />
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.inkSoft }}>
              30 秒一键成片，
            </div>
            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: COLORS.polarisNavy,
                letterSpacing: -1,
                borderBottom: `4px solid ${COLORS.polarisGoldBright}`,
                paddingBottom: 6,
              }}
            >
              北极星 AI 剪辑
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.inkSoft,
                textAlign: 'right',
              }}
            >
              — OpenChatCut 收工 ✨
            </div>
          </div>

          <PolarisBot
            x={botX}
            y={botY}
            t={t}
            mood="cheer"
            rightArm={rightArm}
            speech="拿捏了!"
            speechSide="top"
            scale={1.15}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
