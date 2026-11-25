import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  clamp,
  DURATION_IN_FRAMES,
  ease,
  FONT_MONO,
  FONT_SANS,
  FPS,
  lerp,
  PIPELINE_STAGES,
  spring,
  UI,
} from './theme';
import { AssetTabId, OpenChatCutUI } from './components/OpenChatCutUI';
import { AgentFXLayer, FlyingClipSpec, LaserTether } from './components/AgentFX';
import { CinemaSceneId } from './components/ClipArt';

export { FPS, DURATION_IN_FRAMES };

const formatProTimecode = (sec: number) => {
  // Maps our 30s hyper-edit demo across the 03:30.33 AstraArc film timeline
  const virtualSec = clamp(sec / 27, 0, 1) * 210.33;
  const mins = Math.floor(virtualSec / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(virtualSec % 60)
    .toString()
    .padStart(2, '0');
  const cs = Math.floor((virtualSec % 1) * 100)
    .toString()
    .padStart(2, '0');
  return `00:${mins}:${secs}.${cs}`;
};

const ALL_TOOL_LOGS = [
  { at: 1.0, time: '00.12s', call: 'pipeline.init("AstraArc_Native_v5")', color: UI.goldBright },
  { at: 2.0, time: '00.28s', call: 'story.plan_5_acts(124 assets)', color: UI.goldBright },
  { at: 3.3, time: '00.41s', call: 'voice_cut.trim_silence(26 VO)', color: UI.emerald },
  { at: 4.8, time: '00.64s', call: 'audio.mount("Suno_210s.mp3")', color: UI.emerald },
  { at: 7.9, time: '00.92s', call: 'ai_vision.clay_to_final(Act2)', color: UI.violet },
  { at: 10.2, time: '01.18s', call: 'v2.inject_plates(18 cinema)', color: UI.violet },
  { at: 12.7, time: '01.44s', call: 'motion_pack.batch_jsx(34 MG)', color: UI.magenta },
  { at: 15.0, time: '01.72s', call: 'v3_v4.sync_logo_and_bilingual()', color: UI.magenta },
  { at: 18.4, time: '02.05s', call: 'subtitle.auto_fix(Ctrl+Z)', color: UI.cyan },
  { at: 20.6, time: '02.31s', call: 'imax_mix.beat_lock(-16 LUFS)', color: UI.exportOrange },
  { at: 23.6, time: '02.60s', call: 'render.export_4k(60fps)', color: UI.emerald },
];

/**
 * Master 30-second (900 frames @ 30fps, 1920×1080) OpenChatCut · 北极星 AI 剪辑 Pipeline Motion Film
 */
export const PolarisEditFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // 1. Prompt typing & streaming tool logs
  const fullPrompt =
    '一键全自动剪辑 AstraArc 北迹星品牌片 v5.0：口播净剪 + 34 组原生 JSX 动效 + AI 电影重绘 + Suno 交响 IMAX 鼓点卡点';
  const promptTyped = fullPrompt.slice(0, Math.floor(clamp(t / 2.2) * fullPrompt.length));
  const toolLogs = ALL_TOOL_LOGS.filter((l) => t >= l.at);

  // 2. Active Pipeline Stage (0..5)
  let activeStageIndex = 0;
  for (let i = 0; i < PIPELINE_STAGES.length; i++) {
    if (t >= PIPELINE_STAGES[i].start) activeStageIndex = i;
  }

  // 3. Active & Completed Workflow Plugins
  const activePlugins: string[] = [];
  const donePlugins: string[] = [];
  if (t >= 1.4 && t < 4.0) activePlugins.push('story');
  if (t >= 4.0) donePlugins.push('story');

  if (t >= 3.2 && t < 7.8) activePlugins.push('voice-cut');
  if (t >= 7.8) donePlugins.push('voice-cut');

  if (t >= 7.8 && t < 12.6) activePlugins.push('ai-vision');
  if (t >= 12.6) donePlugins.push('ai-vision');

  if (t >= 12.6 && t < 18.2) {
    activePlugins.push('motion-pack');
    activePlugins.push('highlight');
  }
  if (t >= 18.2) {
    donePlugins.push('motion-pack', 'highlight');
  }

  if (t >= 18.2 && t < 23.4) activePlugins.push('knowledge');
  if (t >= 23.4) donePlugins.push('knowledge');

  // 4. Active Asset Folders & Drawer Tab
  let activeAssetTab: AssetTabId = 'assets';
  if (t >= 3.6 && t < 7.6) activeAssetTab = 'transcript';
  else if (t >= 18.2 && t < 20.4) activeAssetTab = 'subtitles';

  const activeFolders: string[] = [];
  if (t >= 3.2 && t < 7.8) activeFolders.push('vo', 'music');
  if (t >= 7.8 && t < 12.6) activeFolders.push('plates', 'clips');
  if (t >= 12.6 && t < 18.2) activeFolders.push('mg', 'logos', 'clips');
  if (t >= 20.4 && t < 23.6) activeFolders.push('music');

  // 5. Progressive 6-Track Timeline Assembly (Blazing Domino Cascades!)
  const v1Progress = ease((t - 2.2) / 2.2);
  const a1Count = Math.round(clamp((t - 3.4) / 3.6) * 18);
  const a2Progress = ease((t - 4.4) / 2.6);

  // V2 injects first 6 clips in Stage 3 (8.0–12.4s), then fires remaining 12 clips in Overdrive Stage 4 (12.6–16.8s)
  const v2Stage3 = Math.round(clamp((t - 8.0) / 4.2) * 6);
  const v2Stage4 = Math.round(clamp((t - 12.6) / 3.8) * 12);
  const v2Count = Math.min(18, v2Stage3 + v2Stage4);

  // Momentary bad-take slice highlight on V2 at 8.4s – 9.6s
  const v2TrimGapOpen =
    t >= 8.35 && t < 9.75
      ? ease((t - 8.35) / 0.35) * (1 - ease((t - 9.25) / 0.5))
      : 0;

  // V3 Brand Logo bar + V4 15 Bilingual Subtitle clips slam in during Overdrive Stage 4
  const v3Progress = ease((t - 13.4) / 2.2);
  const v4Count = Math.round(clamp((t - 14.0) / 3.6) * 15);

  // Beat-sync markers cascade across Suno symphony track in Stage 5
  const beatMarkersProgress = ease((t - 20.5) / 2.3);
  const beatPulse =
    t >= 20.8 && t < 27.0
      ? Math.pow(Math.max(0, Math.sin(t * Math.PI * 4.5)), 5)
      : 0;

  // LUT & color grade boost in Stage 5
  const lutBoost = ease((t - 20.4) / 1.4);

  // Playhead sweeps dynamically across the 6 tracks
  const playheadPct =
    t < 2.2
      ? 0.02
      : t < 7.8
        ? lerp(0.02, 0.42, (t - 2.2) / 5.6)
        : t < 12.6
          ? lerp(0.24, 0.55, (t - 7.8) / 4.8)
          : t < 18.2
            ? lerp(0.15, 0.94, (t - 12.6) / 5.6)
            : t < 23.4
              ? lerp(0.32, 0.88, (t - 18.2) / 5.2)
              : lerp(0.05, 0.98, (t - 23.4) / 6.6);

  // 6. Live Cinema Monitor Scene & Subtitles
  let cinemaScene: CinemaSceneId = 'shift';
  if (t >= 8.2 && t < 12.8) cinemaScene = 'clay_morph';
  else if (t >= 12.8 && t < 15.6) cinemaScene = 'matrix';
  else if (t >= 15.6 && t < 18.2) cinemaScene = 'prism';
  else if (t >= 18.2 && t < 20.6) cinemaScene = 'shift';
  else if (t >= 20.6 && t < 23.2) cinemaScene = 'matrix';
  else if (t >= 23.2) cinemaScene = 'finale';

  const morphProgress = ease((t - 9.4) / 2.4);

  const isSubtitleTypo = t >= 18.2 && t < 19.35;
  let subtitleZh: string | undefined =
    '在今天的商业世界里，企业面临的挑战，正在发生深刻变化。';
  let subtitleEn: string | undefined =
    "In today's business world, the challenges enterprises face are undergoing profound change.";

  if (t < 3.4) {
    subtitleZh = undefined;
    subtitleEn = undefined;
  } else if (cinemaScene === 'clay_morph') {
    subtitleZh = 'AstraArc Design · 从概念白模到电影级商业空间，瞬时生成。';
    subtitleEn = 'From raw architectural clay to cinema-grade flagship spaces in seconds.';
  } else if (cinemaScene === 'matrix') {
    subtitleZh = '34 组原生 JSX 动效模板并发装轨，打破传统重型摄制边界。';
    subtitleEn = '34 native JSX motion graphics orchestrated concurrently across 6 tracks.';
  } else if (cinemaScene === 'prism') {
    subtitleZh = '让信息自动流动，让创意与算力精准折射商业价值。';
    subtitleEn = 'Intelligence that turns strategic clarity into automated production.';
  } else if (isSubtitleTypo) {
    subtitleZh = '让更好的商业想象，真正发声。（AI 检测到错别字!）';
    subtitleEn = 'Detecting typo mismatch -> invoking Auto-Fix...';
  } else if (t >= 19.35) {
    subtitleZh = '让更好的商业想象，真正发生。';
    subtitleEn = 'Making greater commercial imagination truly happen.';
  }

  // Transition lens flash right on act switches
  const cutTimes = [8.2, 12.8, 15.6, 18.2, 20.6, 23.2];
  let transitionFlash = 0;
  for (const ct of cutTimes) {
    const dt = t - ct;
    if (dt >= 0 && dt < 0.35) {
      transitionFlash = Math.max(transitionFlash, 1 - dt / 0.35);
    }
  }

  // 7. Export Progress (23.4s – 26.2s)
  let exportState: 'idle' | 'rendering' | 'done' = 'idle';
  let renderPct = 0;
  if (t >= 23.6 && t < 25.9) {
    exportState = 'rendering';
    renderPct =
      t < 25.3
        ? lerp(0, 99.99, ease((t - 23.6) / 1.7))
        : 99.99;
  } else if (t >= 25.9) {
    exportState = 'done';
    renderPct = 100;
  }

  // 8. Smooth 2D Cinema Camera Rig (Dynamic Macro Zooms, zero software-3D slowdown!)
  let camScale = 1.0;
  let camX = 0;
  let camY = 0;

  if (t < 3.2) {
    // Stage 1: Macro push onto Left Agent Workbench
    const z = ease(t / 1.0) * (1 - ease((t - 2.6) / 0.6));
    camScale = 1 + 0.16 * z;
    camX = 120 * z;
    camY = -10 * z;
  } else if (t >= 8.0 && t < 12.4) {
    // Stage 3: Push onto Preview Monitor + V2 Clay->Final AI Morph
    const z = ease((t - 8.0) / 0.6) * (1 - ease((t - 11.8) / 0.6));
    camScale = 1 + 0.14 * z;
    camX = -95 * z;
    camY = 38 * z;
  } else if (t >= 12.6 && t < 18.0) {
    // Stage 4: Overdrive dynamic heroic push
    const z = ease((t - 12.6) / 0.5) * (1 - ease((t - 17.4) / 0.6));
    camScale = 1 + 0.06 * z;
    camY = -28 * z;
  } else if (t >= 23.5 && t < 26.2) {
    // Stage 6a: Zoom up-right to the glowing Export button!
    const z = ease((t - 23.5) / 0.45) * (1 - ease((t - 25.7) / 0.5));
    camScale = 1 + 0.18 * z;
    camX = -130 * z;
    camY = 78 * z;
  }

  // 9. Hyper-Kinetic Polaris Agent Choreography + Multi-Channel Laser Tethers + Flying Clip Cards!
  let agentX = 465;
  let agentY = 580;
  let overdrive = false;
  let mood: 'ready' | 'hyper' | 'slice' | 'fix' | 'cheer' = 'ready';
  let speech: string | undefined;
  const tethers: LaserTether[] = [];
  const flyingClips: FlyingClipSpec[] = [];
  let sliceLine: { x: number; y1: number; y2: number; progress: number } | undefined;

  if (t < 3.2) {
    agentX = lerp(320, 560, ease((t - 1.2) / 1.4));
    agentY = lerp(840, 560, ease((t - 1.2) / 1.4));
    mood = 'ready';
    if (t >= 1.4) {
      speech = '⚡ 北极星 Pipeline 启动！拆解 5 幕脚本';
      tethers.push(
        { x: 380, y: 528, color: UI.goldBright },
        { x: 960, y: 895, color: UI.clipVideo }
      );
    }
  } else if (t < 7.8) {
    // Stage 2: 口播净剪 + Suno 交响铺底
    const p = (t - 3.2) / 4.6;
    agentX = lerp(560, 960, ease(p));
    agentY = 665 + Math.sin(t * 6) * 14;
    mood = 'hyper';
    speech = '✂ 口播净剪 · 26 轨旁白去气口极速入轨！';
    const targetTrackX = 650 + p * 1160;
    tethers.push(
      { x: 380, y: 288, color: UI.emerald }, // 口播净剪 plugin
      { x: targetTrackX, y: 952, color: UI.emerald }, // A1 VO track
      { x: 650 + ease((t - 4.4) / 2.6) * 1180, y: 1018, color: UI.goldBright } // A2 Suno track
    );
    // 6 rapid-fire flying emerald VO packets
    for (let k = 0; k < 6; k++) {
      const start = 3.4 + k * 0.58;
      flyingClips.push({
        id: `vo-${k}`,
        sx: 380,
        sy: 288,
        ex: 720 + k * 195,
        ey: 952,
        progress: (t - start) / 0.55,
        color: UI.emerald,
        label: `VO S${String(k * 4 + 1).padStart(2, '0')}`,
      });
    }
  } else if (t < 12.6) {
    // Stage 3: Plasma Slice + AI 影像 Clay->Final Morph
    agentX = lerp(960, 1280, ease((t - 7.8) / 3.8));
    agentY = 585;
    mood = t < 9.5 ? 'slice' : 'hyper';
    speech =
      t < 9.5
        ? '✂ 识别冗余停顿 · 等离子瞬切！'
        : '🎨 AI 影像 · 商业空间白模 → 电影成图重绘！';
    tethers.push(
      { x: 380, y: 608, color: UI.violet }, // AI 影像 plugin
      { x: 616, y: 360, color: UI.violet }, // 02 电影级视觉底板 folder
      { x: 960 + morphProgress * 820, y: 360, color: UI.goldBright }, // Live morph scanline in monitor!
      { x: 780 + ease((t - 8.2) / 4.0) * 440, y: 830, color: UI.magenta } // V2 track
    );
    if (t >= 8.55 && t < 9.3) {
      sliceLine = { x: 985, y1: 785, y2: 875, progress: (t - 8.55) / 0.55 };
    }
    for (let k = 0; k < 4; k++) {
      const start = 8.4 + k * 0.85;
      flyingClips.push({
        id: `plate-${k}`,
        sx: 616,
        sy: 360,
        ex: 720 + k * 135,
        ey: 830,
        progress: (t - start) / 0.52,
        color: UI.violet,
        label: `ACT0${k + 1}.PNG`,
      });
    }
  } else if (t < 18.2) {
    // Stage 4: OVERDRIVE MULTI-ARM BURST! (34× JSX + Logo + Bilingual Subtitles ALL AT ONCE!)
    overdrive = true;
    mood = 'hyper';
    const p = (t - 12.6) / 5.6;
    agentX = 1040 + Math.sin(t * 3.8) * 180;
    agentY = 600 + Math.cos(t * 4.5) * 42;
    speech = '🔥 OVERDRIVE · 34 组原生 JSX + 双语字幕 6 轨并发暴走！';
    tethers.push(
      { x: 380, y: 368, color: UI.magenta }, // 动态包装 plugin
      { x: 472, y: 360, color: UI.magenta }, // 01 原生 JSX 动效 folder
      { x: 680 + p * 1160, y: 710, color: UI.cyan }, // V4 bilingual subtitles
      { x: 700 + ease((t - 13.4) / 2.2) * 1140, y: 770, color: UI.goldBright }, // V3 brand logo
      { x: 980 + p * 860, y: 830, color: UI.magenta } // V2 JSX clips
    );
    // Rapid-fire storm of 10 holographic JSX & Subtitle cards!
    for (let k = 0; k < 10; k++) {
      const start = 12.7 + k * 0.44;
      const toV4 = k % 2 === 1;
      flyingClips.push({
        id: `jsx-${k}`,
        sx: toV4 ? 380 : 472,
        sy: toV4 ? 368 : 360,
        ex: 720 + k * 112,
        ey: toV4 ? 710 : 830,
        progress: (t - start) / 0.42,
        color: toV4 ? UI.cyan : UI.magenta,
        label: toV4 ? `字幕 S${String(k * 2 + 1).padStart(2, '0')}` : `JSX #${String(k * 3 + 2).padStart(2, '0')}`,
      });
    }
  } else if (t < 23.4) {
    // Stage 5: 字幕瞬时纠错 (⌘Z) + IMAX 鼓点卡点 & LUT 调色
    agentX = t < 20.4 ? 1160 : lerp(1160, 1460, ease((t - 20.4) / 2.2));
    agentY = 595;
    mood = t < 20.4 ? 'fix' : 'hyper';
    overdrive = t >= 20.6;
    speech =
      t < 20.4
        ? '⚡ AI 质检捕获错字 · ⌘Z 瞬时精校！'
        : '🔊 IMAX -16.0 LUFS · Suno 鼓点全轨毫秒级对齐！';
    if (t < 20.4) {
      tethers.push(
        { x: 1315, y: 550, color: UI.cyan },
        { x: 1180, y: 710, color: UI.emerald }
      );
    } else {
      tethers.push(
        { x: 380, y: 688, color: UI.exportOrange },
        { x: 1320, y: 340, color: UI.goldBright },
        { x: 660 + beatMarkersProgress * 1200, y: 1018, color: UI.goldBright },
        { x: 660 + beatMarkersProgress * 1180, y: 830, color: UI.magenta }
      );
    }
  } else if (t < 26.2) {
    // Stage 6a: Hyper-Speed 4K Render & Export
    agentX = 1480;
    agentY = 480;
    mood = exportState === 'done' ? 'cheer' : 'hyper';
    speech =
      exportState === 'done'
        ? '✨ 叮！4K 60fps 电影成片导出完成！'
        : renderPct > 99
          ? '⏳ 99.99% 最后一帧校准...'
          : '🚀 GPU 硬件加速 · 极速渲染中...';
    tethers.push({ x: 1790, y: 27, color: exportState === 'done' ? UI.emerald : UI.exportOrange });
  } else {
    // Stage 6b: Triumphant Showcase
    agentX = 1765;
    agentY = 535;
    mood = 'cheer';
    speech = '✦ 全流程自动剪辑完成！';
  }

  return (
    <AbsoluteFill
      style={{
        background: '#050608',
        overflow: 'hidden',
        fontFamily: FONT_SANS,
      }}
    >
      {/* Smooth Cinema Camera Rig wrapping OpenChatCut UI + Agent FX */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${camScale}) translate(${camX}px, ${camY}px)`,
          transformOrigin: '50% 50%',
        }}
      >
        <OpenChatCutUI
          t={t}
          timecode={formatProTimecode(t)}
          activePlugins={activePlugins}
          donePlugins={donePlugins}
          activeFolders={activeFolders}
          activeAssetTab={activeAssetTab}
          promptTyped={promptTyped}
          toolLogs={toolLogs}
          cinemaScene={cinemaScene}
          morphProgress={morphProgress}
          subtitleZh={subtitleZh}
          subtitleEn={subtitleEn}
          subtitleError={isSubtitleTypo}
          lutBoost={lutBoost}
          beatPulse={beatPulse}
          transitionFlash={transitionFlash}
          v1Progress={v1Progress}
          v2Count={v2Count}
          v2TrimGapOpen={v2TrimGapOpen}
          v3Progress={v3Progress}
          v4Count={v4Count}
          a1Count={a1Count}
          a2Progress={a2Progress}
          beatMarkersProgress={beatMarkersProgress}
          playheadPct={playheadPct}
          exportState={exportState}
          renderPct={renderPct}
          activeStageIndex={activeStageIndex}
        />

        <AgentFXLayer
          t={t}
          agentX={agentX}
          agentY={agentY}
          overdrive={overdrive}
          mood={mood}
          tethers={tethers}
          flyingClips={flyingClips}
          speech={speech}
          sliceLine={sliceLine}
        />

        {/* Holographic ⌘Z AUTO-FIX Keycap (18.7s – 19.6s) */}
        {t >= 18.7 && t < 19.7 && (
          <div
            style={{
              position: 'absolute',
              left: 1180,
              top: 410,
              padding: '14px 28px',
              borderRadius: 14,
              background: 'rgba(13, 17, 28, 0.94)',
              border: `2.5px solid ${UI.cyan}`,
              boxShadow: `0 0 36px ${UI.cyan}88, 0 8px 0 #0e3a5c`,
              color: '#ffffff',
              fontFamily: FONT_MONO,
              fontSize: 32,
              fontWeight: 900,
              transform: `scale(${spring(t - 18.7)})`,
              zIndex: 45,
            }}
          >
            ⌘Z · AUTO-FIX
          </div>
        )}

        {/* Emerald Verified Stamp: 已自动精校 ✓ (19.35s – 20.5s) */}
        {t >= 19.35 && t < 20.5 && (
          <div
            style={{
              position: 'absolute',
              left: 1460,
              top: 390,
              padding: '10px 24px',
              borderRadius: 12,
              background: 'rgba(6, 28, 18, 0.92)',
              border: `3px solid ${UI.emerald}`,
              boxShadow: `0 0 30px ${UI.emerald}77`,
              color: UI.emerald,
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: 3,
              transform: `rotate(-8deg) scale(${spring(t - 19.35)})`,
              zIndex: 46,
            }}
          >
            已自动精校 ✓
          </div>
        )}

        {/* Floating Live Grading & IMAX Beat-Sync HUD Pill (20.5s – 23.4s) */}
        {t >= 20.5 && t < 23.4 && (
          <div
            style={{
              position: 'absolute',
              left: 920,
              top: 528,
              padding: '12px 22px',
              borderRadius: 14,
              background: 'rgba(12, 14, 22, 0.94)',
              border: `1.8px solid ${UI.goldBright}`,
              boxShadow: `0 10px 36px rgba(0,0,0,0.65), 0 0 26px ${UI.goldBright}44`,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              fontFamily: FONT_MONO,
              fontSize: 14,
              color: '#ffffff',
              transform: `scale(${spring(t - 20.5)})`,
              zIndex: 46,
            }}
          >
            <span style={{ color: UI.goldBright, fontWeight: 800 }}>✦ LUT: ASTRAARC GOLD</span>
            <span style={{ color: UI.emerald, fontWeight: 800 }}>LOUDNESS: -16.0 LUFS</span>
            <span style={{ color: UI.magenta, fontWeight: 800 }}>BEAT LOCK: 128 BPM</span>
          </div>
        )}
      </div>

      {/* Stage 6b (26.3s – 30.0s): Sleek OpenChatCut · 北极星 AI Pipeline Finale Summary Card */}
      {t >= 26.3 && (
        <div
          style={{
            position: 'absolute',
            left: 428,
            top: 96,
            width: 430,
            borderRadius: 18,
            background: 'rgba(12, 15, 24, 0.94)',
            border: `2px solid ${UI.goldBright}`,
            boxShadow: `0 24px 64px rgba(0,0,0,0.75), 0 0 42px ${UI.goldBright}33`,
            padding: '24px 26px',
            boxSizing: 'border-box',
            transform: `translateY(${(1 - spring(t - 26.3)) * 36}px) scale(${0.92 + 0.08 * spring(t - 26.3)})`,
            zIndex: 60,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              borderRadius: 999,
              background: `${UI.emerald}22`,
              border: `1px solid ${UI.emerald}`,
              color: UI.emerald,
              fontFamily: FONT_MONO,
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 14,
            }}
          >
            ⚡ PIPELINE COMPLETED · 03:30.33
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#ffffff', letterSpacing: -0.6 }}>
            北极星 AI 剪辑
          </div>
          <div style={{ fontSize: 14, color: UI.gold, marginTop: 4, marginBottom: 18 }}>
            OpenChatCut 全自动多轨生产管线
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { k: '调度插件', v: '6 大并发', c: UI.goldBright },
              { k: '装轨素材', v: '124 项', c: UI.cyan },
              { k: '原生动效', v: '34 组 JSX', c: UI.magenta },
              { k: '声音混音', v: '26 VO + IMAX', c: UI.emerald },
            ].map((item) => (
              <div
                key={item.k}
                style={{
                  borderRadius: 10,
                  background: '#161a26',
                  border: `1px solid ${UI.borderLight}`,
                  padding: '10px 12px',
                }}
              >
                <div style={{ fontSize: 11, color: UI.textSecondary }}>{item.k}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: item.c, fontFamily: FONT_MONO, marginTop: 2 }}>
                  {item.v}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: `1px solid ${UI.borderLight}`,
              paddingTop: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 12,
              color: UI.textSecondary,
            }}
          >
            <span>AstraArc_Partners_Native_v5.ccproj</span>
            <span style={{ color: UI.goldBright, fontWeight: 800 }}>4K 60fps ✓</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
