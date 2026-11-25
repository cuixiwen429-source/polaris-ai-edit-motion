import React from 'react';
import {
  ASSET_FOLDERS,
  clamp,
  FONT_MONO,
  FONT_SANS,
  PIPELINE_STAGES,
  SUBTITLE_CLIPS,
  UI,
  V2_CLIPS,
  VO_CLIPS,
  WORKFLOW_PLUGINS,
} from '../theme';
import { CinemaPreview, CinemaSceneId } from './ClipArt';

export type AssetTabId = 'assets' | 'sequence' | 'library' | 'transcript' | 'subtitles' | 'skills';

export interface OpenChatCutProps {
  t: number;
  timecode: string;
  activePlugins: string[];
  donePlugins: string[];
  activeFolders: string[];
  activeAssetTab: AssetTabId;
  promptTyped: string;
  toolLogs: { time: string; call: string; color: string }[];
  // Monitor state
  cinemaScene: CinemaSceneId;
  morphProgress: number;
  subtitleZh?: string;
  subtitleEn?: string;
  subtitleError?: boolean;
  lutBoost: number;
  beatPulse: number;
  transitionFlash: number;
  // Timeline assembly counts & states
  v1Progress: number; // 0..1 continuous cosmos base
  v2Count: number; // 0..18 dense JSX/Act blocks
  v2TrimGapOpen: number; // 0..1 when bad-take silence is being sliced out
  v3Progress: number; // 0..1 continuous brand logo bar
  v4Count: number; // 0..15 dense bilingual subtitle blocks
  a1Count: number; // 0..18 dense VO blocks
  a2Progress: number; // 0..1 continuous Suno symphony waveform
  beatMarkersProgress: number; // 0..1
  playheadPct: number; // 0..1 across timeline
  // Export button state
  exportState: 'idle' | 'rendering' | 'done';
  renderPct: number;
  // Floating HUDs
  activeStageIndex: number; // 0..5
}

/**
 * Pixel-faithful Dark Pro NLE UI of OpenChatCut (1920×1080),
 * directly modeled on the user's real AstraArc_Partners_Native_v5.ccproj workspace.
 */
export const OpenChatCutUI: React.FC<OpenChatCutProps> = (p) => {
  const { t } = p;
  const currentStage = PIPELINE_STAGES[Math.min(PIPELINE_STAGES.length - 1, Math.max(0, p.activeStageIndex))];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: UI.bgApp,
        color: UI.textPrimary,
        fontFamily: FONT_SANS,
        overflow: 'hidden',
        border: `1px solid ${UI.border}`,
      }}
    >
      {/* ==================== 1. TOP WINDOW HEADER BAR ==================== */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 54,
          background: UI.bgHeader,
          borderBottom: `1px solid ${UI.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 18px',
          boxSizing: 'border-box',
        }}
      >
        {/* Left macOS dots + OpenChatCut title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
              <span
                key={c}
                style={{ width: 13, height: 13, borderRadius: '50%', background: c, display: 'inline-block' }}
              />
            ))}
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#e5e7eb', letterSpacing: 0.2 }}>
            OpenChatCut
          </span>
          <span style={{ color: UI.textMuted, fontSize: 15 }}>⌂</span>
        </div>

        {/* Center project title + Live Pipeline pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#f3f4f6' }}>
            AstraArc Partners 北迹星品牌片 v5.0（原生可编辑工程）
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '4px 12px',
              borderRadius: 999,
              background: `${currentStage.color}1a`,
              border: `1px solid ${currentStage.color}88`,
              fontSize: 12,
              fontFamily: FONT_MONO,
              fontWeight: 700,
              color: currentStage.color,
              boxShadow: `0 0 16px ${currentStage.color}33`,
            }}
          >
            <span>⚡ PIPELINE {currentStage.num}/06</span>
            <span>·</span>
            <span>{currentStage.label}</span>
          </div>
        </div>

        {/* Right toolbar icons + Orange 导出 Button + Orb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 14, color: UI.textSecondary, fontSize: 15 }}>
            <span>↶</span>
            <span>↷</span>
            <span>▤</span>
            <span>◑</span>
            <span>✦</span>
            <span>⤓</span>
          </div>
          <div
            style={{
              minWidth: p.exportState === 'idle' ? 76 : 146,
              height: 32,
              borderRadius: 8,
              background:
                p.exportState === 'done'
                  ? '#16a34a'
                  : p.exportState === 'rendering'
                    ? '#272932'
                    : `linear-gradient(135deg, ${UI.exportOrange}, #f59e0b)`,
              border:
                p.exportState === 'rendering'
                  ? `1.5px solid ${UI.goldBright}`
                  : '1px solid rgba(255,255,255,0.18)',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 14px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow:
                p.exportState === 'done'
                  ? '0 0 24px rgba(34, 197, 94, 0.7)'
                  : p.exportState === 'rendering'
                    ? '0 0 22px rgba(246, 201, 91, 0.45)'
                    : '0 2px 12px rgba(232, 139, 53, 0.4)',
            }}
          >
            {p.exportState === 'rendering' && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${p.renderPct}%`,
                  background: 'linear-gradient(90deg, #e88b35, #f6c95b)',
                }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>
              {p.exportState === 'done'
                ? '⚡ 4K 导出完成 ✓'
                : p.exportState === 'rendering'
                  ? `渲染中 ${p.renderPct.toFixed(p.renderPct > 99 ? 2 : 0)}%`
                  : '导出'}
            </span>
          </div>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'conic-gradient(from 45deg, #f97316, #ec4899, #8b5cf6, #38bdf8, #34d399, #f97316)',
              boxShadow: '0 0 12px rgba(236, 72, 153, 0.45)',
            }}
          />
        </div>
      </div>

      {/* ==================== 2. LEFT SIDEBAR: OPEN CHAT CUT AGENT WORKBENCH ==================== */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 54,
          bottom: 0,
          width: 406,
          background: UI.bgPanel,
          borderRight: `1px solid ${UI.border}`,
          padding: '16px 18px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Brand Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #1b2640, #2e3f68)',
                border: `1.5px solid ${UI.gold}`,
                display: 'grid',
                placeItems: 'center',
                color: UI.goldBright,
                fontSize: 16,
              }}
            >
              ✦
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    background: '#ffffff',
                    color: '#0f1013',
                    fontWeight: 900,
                    fontSize: 12,
                    padding: '1px 6px',
                    borderRadius: 4,
                  }}
                >
                  OPEN
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>Chat Cut</span>
              </div>
              <div style={{ fontSize: 11, color: UI.textSecondary, marginTop: 1 }}>
                北极星 Agent 工作台
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, color: UI.textMuted, fontSize: 14 }}>
            <span>≡</span>
            <span>＋</span>
          </div>
        </div>

        {/* Section Heading */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: UI.exportOrange, marginBottom: 3 }}>
            从这里开工 · AUTONOMOUS PIPELINE
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', letterSpacing: -0.4 }}>
            从一个剪辑目标开始
          </div>
          <div style={{ fontSize: 12, color: UI.textSecondary, marginTop: 3 }}>
            Agent 自动调度 6 大插件并发写入多轨时间轴
          </div>
        </div>

        {/* 6 Workflow Plugin Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {WORKFLOW_PLUGINS.map((pl) => {
            const isActive = p.activePlugins.includes(pl.id);
            const isDone = p.donePlugins.includes(pl.id);
            return (
              <div
                key={pl.id}
                style={{
                  height: 68,
                  borderRadius: 12,
                  background: isActive
                    ? `linear-gradient(90deg, ${pl.color}24, ${UI.bgCard})`
                    : UI.bgSurface,
                  border: `1.5px solid ${isActive ? pl.color : isDone ? `${pl.color}55` : UI.border}`,
                  boxShadow: isActive ? `0 0 24px ${pl.color}38, inset 0 0 18px ${pl.color}18` : undefined,
                  padding: '0 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transform: isActive ? 'translateX(4px)' : undefined,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: isActive ? pl.color : `${pl.color}1f`,
                      color: isActive ? '#090a0d' : pl.color,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 16,
                      fontWeight: 900,
                    }}
                  >
                    {pl.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>{pl.title}</div>
                    <div style={{ fontSize: 12, color: UI.textSecondary, marginTop: 2 }}>{pl.desc}</div>
                  </div>
                </div>
                {isActive ? (
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#090a0d',
                      background: pl.color,
                      padding: '3px 8px',
                      borderRadius: 999,
                    }}
                  >
                    ⚡ RUNNING
                  </span>
                ) : isDone ? (
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: 700,
                      color: UI.emerald,
                    }}
                  >
                    DONE ✓
                  </span>
                ) : (
                  <span style={{ color: UI.textMuted, fontSize: 12 }}>→</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Agent Live Tool-Call & Prompt Console */}
        <div
          style={{
            marginTop: 'auto',
            borderRadius: 14,
            background: '#0e1015',
            border: `1.5px solid ${p.activePlugins.length > 0 ? UI.gold + '66' : UI.borderLight}`,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
          }}
        >
          {/* Live streaming tool call pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 84 }}>
            {p.toolLogs.slice(-4).map((log, i) => (
              <div
                key={`${log.time}-${i}`}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: i === p.toolLogs.slice(-4).length - 1 ? '#ffffff' : UI.textSecondary,
                }}
              >
                <span style={{ color: log.color, fontWeight: 800 }}>▸</span>
                <span style={{ color: UI.textMuted }}>{log.time}</span>
                <span style={{ color: log.color, fontWeight: 700 }}>{log.call}</span>
              </div>
            ))}
          </div>

          {/* Prompt text */}
          <div
            style={{
              background: '#16181f',
              borderRadius: 9,
              padding: '8px 10px',
              fontSize: 12.5,
              lineHeight: 1.45,
              color: '#e5e7eb',
              border: `1px solid ${UI.border}`,
              minHeight: 42,
            }}
          >
            {p.promptTyped}
            <span
              style={{
                display: 'inline-block',
                width: 2,
                height: 14,
                background: UI.goldBright,
                marginLeft: 3,
                verticalAlign: 'middle',
                opacity: Math.sin(t * 14) > 0 ? 1 : 0,
              }}
            />
          </div>

          {/* Agent status bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              color: UI.textSecondary,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: UI.goldBright, fontWeight: 700 }}>✦ Agent ▾</span>
              <span style={{ color: UI.emerald, fontFamily: FONT_MONO, fontSize: 11 }}>
                北极星 Pipeline v5
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: UI.textMuted }}>
                184k / 1.0M
              </span>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: UI.goldBright,
                  color: '#090a0d',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 900,
                  fontSize: 13,
                }}
              >
                ↑
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 3. MIDDLE-LEFT: ASSET & PLUGIN DRAWER ==================== */}
      <div
        style={{
          position: 'absolute',
          left: 406,
          top: 54,
          width: 470,
          height: 562,
          background: UI.bgSurface,
          borderRight: `1px solid ${UI.border}`,
          borderBottom: `1px solid ${UI.border}`,
          padding: '12px 16px',
          boxSizing: 'border-box',
        }}
      >
        {/* Tabs matching screenshot: 我的素材 | 序列 | 资源库 | 文字稿 | 字幕 | 技能 */}
        <div
          style={{
            display: 'flex',
            gap: 18,
            borderBottom: `1px solid ${UI.border}`,
            paddingBottom: 10,
            marginBottom: 12,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {[
            { id: 'assets' as AssetTabId, label: '我的素材' },
            { id: 'sequence' as AssetTabId, label: '序列' },
            { id: 'library' as AssetTabId, label: '资源库' },
            { id: 'transcript' as AssetTabId, label: '文字稿' },
            { id: 'subtitles' as AssetTabId, label: '字幕' },
            { id: 'skills' as AssetTabId, label: '技能' },
          ].map((tab) => {
            const active = p.activeAssetTab === tab.id;
            return (
              <span
                key={tab.id}
                style={{
                  color: active ? '#ffffff' : UI.textSecondary,
                  borderBottom: active ? `2px solid ${UI.goldBright}` : '2px solid transparent',
                  paddingBottom: 8,
                  marginBottom: -11,
                }}
              >
                {tab.label}
              </span>
            );
          })}
        </div>

        {/* Search + quick filter row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div
            style={{
              flex: 1,
              height: 32,
              borderRadius: 8,
              background: '#111216',
              border: `1px solid ${UI.border}`,
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              fontSize: 12,
              color: UI.textMuted,
            }}
          >
            🔍 搜索 124 项工程素材 / JSX 模板...
          </div>
          <span style={{ color: UI.goldBright, fontSize: 15 }}>✦</span>
          <span style={{ color: UI.textSecondary, fontSize: 14 }}>⇅</span>
        </div>

        {/* Content by active tab */}
        {p.activeAssetTab === 'transcript' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, color: UI.emerald, fontFamily: FONT_MONO, fontWeight: 700 }}>
              ✂ AI 口播净剪 · 自动识别气口与冗余停顿 (14 处已标记)
            </div>
            {[
              { s: 'S01', text: '在今天的商业世界里，企业面临的挑战正在发生深刻变化', cut: '[0.6s 静音]' },
              { s: 'S04', text: '这正是 AstraArc Partners 北迹星诞生的初心', cut: '嗯...' },
              { s: 'S09', text: 'AstraArc Design 用 AI 重塑商业空间与品牌设计', cut: '[0.9s 气口]' },
              { s: 'S15', text: 'AstraArc Motion 打破传统重型影棚的制作边界', cut: '那个...' },
              { s: 'S26', text: '让更好的商业想象，真正发生。', cut: null },
            ].map((row) => (
              <div
                key={row.s}
                style={{
                  padding: '9px 12px',
                  borderRadius: 9,
                  background: '#12141a',
                  border: `1px solid ${UI.border}`,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ fontFamily: FONT_MONO, color: UI.emerald, fontWeight: 700, marginRight: 8 }}>
                  {row.s}
                </span>
                <span style={{ color: '#f3f4f6' }}>{row.text}</span>
                {row.cut && (
                  <span
                    style={{
                      marginLeft: 8,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#fca5a5',
                      textDecoration: 'line-through',
                      fontSize: 11,
                      fontFamily: FONT_MONO,
                    }}
                  >
                    {row.cut}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* 6 Real Asset Folders Grid from AstraArc_Partners_Native_v5.ccproj */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginTop: 14,
            }}
          >
            {ASSET_FOLDERS.map((fld) => {
              const hot = p.activeFolders.includes(fld.id);
              return (
                <div
                  key={fld.id}
                  style={{
                    height: 116,
                    borderRadius: 12,
                    background: hot ? `${fld.color}22` : '#1f2229',
                    border: `1.5px solid ${hot ? fld.color : UI.borderLight}`,
                    boxShadow: hot ? `0 0 26px ${fld.color}44` : undefined,
                    padding: 12,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transform: hot ? 'scale(1.04)' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 22, color: hot ? fld.color : UI.textSecondary }}>
                      {hot ? '⚡' : '📁'}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        fontWeight: 700,
                        color: hot ? '#090a0d' : fld.color,
                        background: hot ? fld.color : `${fld.color}1e`,
                        padding: '2px 7px',
                        borderRadius: 6,
                      }}
                    >
                      {fld.count}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f3f4f6', lineHeight: 1.3 }}>
                    {fld.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Live Pipeline Stage Telemetry Footer inside Drawer */}
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 14,
            height: 74,
            borderRadius: 11,
            background: '#111319',
            border: `1px solid ${UI.borderLight}`,
            padding: '10px 12px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: FONT_MONO }}>
            <span style={{ color: UI.gold }}>OPENCHATCUT PIPELINE ENGINE</span>
            <span style={{ color: UI.emerald }}>
              {p.v2Count + p.a1Count + p.v4Count} / 51 CLIPS SYNCED
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {PIPELINE_STAGES.map((st, idx) => {
              const active = idx === p.activeStageIndex;
              const done = idx < p.activeStageIndex;
              return (
                <div
                  key={st.id}
                  style={{
                    flex: 1,
                    height: 28,
                    borderRadius: 6,
                    background: active ? st.color : done ? `${st.color}2e` : '#1a1d24',
                    border: `1px solid ${active || done ? st.color : UI.border}`,
                    color: active ? '#090a0d' : done ? st.color : UI.textMuted,
                    fontSize: 10.5,
                    fontWeight: 800,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {st.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================== 4. MIDDLE-RIGHT: LIVE CINEMA MONITOR ("预览") ==================== */}
      <div
        style={{
          position: 'absolute',
          left: 876,
          right: 0,
          top: 54,
          height: 562,
          background: UI.bgMonitor,
          borderBottom: `1px solid ${UI.border}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Monitor Header */}
        <div
          style={{
            height: 40,
            padding: '0 18px',
            borderBottom: `1px solid ${UI.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13,
            color: UI.textSecondary,
          }}
        >
          <span style={{ fontWeight: 700, color: '#f3f4f6' }}>预览</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span>评论</span>
            <span style={{ padding: '2px 8px', borderRadius: 5, background: '#1b1d24', color: '#e5e7eb' }}>
              预览画质: 高清
            </span>
            <span style={{ color: UI.gold }}>安全框</span>
          </div>
        </div>

        {/* 16:9 Cinema Stage */}
        <div
          style={{
            flex: 1,
            padding: '12px 24px',
            boxSizing: 'border-box',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <div
            style={{
              width: 880,
              height: 495,
              borderRadius: 6,
              overflow: 'hidden',
              border: `1px solid ${p.beatPulse > 0.35 ? UI.goldBright : '#232630'}`,
              boxShadow:
                p.beatPulse > 0.35
                  ? `0 0 38px rgba(246, 201, 91, 0.35)`
                  : '0 14px 40px rgba(0,0,0,0.65)',
            }}
          >
            <CinemaPreview
              scene={p.cinemaScene}
              t={t}
              morphProgress={p.morphProgress}
              subtitleZh={p.subtitleZh}
              subtitleEn={p.subtitleEn}
              subtitleError={p.subtitleError}
              lutBoost={p.lutBoost}
              beatPulse={p.beatPulse}
              transitionFlash={p.transitionFlash}
            />
          </div>
        </div>
      </div>

      {/* ==================== 5. BOTTOM: 6-TRACK OPENCHATCUT PRO TIMELINE ==================== */}
      <div
        style={{
          position: 'absolute',
          left: 406,
          right: 0,
          top: 616,
          bottom: 0,
          background: UI.bgPanel,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Timeline Transport Toolbar */}
        <div
          style={{
            height: 42,
            borderBottom: `1px solid ${UI.border}`,
            padding: '0 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 14,
            color: UI.textSecondary,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ color: '#ffffff', fontWeight: 800 }}>＋</span>
            <span>🧲</span>
            <span>↶</span>
            <span>↷</span>
            <span>✂</span>
            <span style={{ color: UI.goldBright, fontFamily: FONT_MONO, fontSize: 12 }}>
              ⚡ AUTO-EDIT ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT_MONO }}>
            <span style={{ color: '#ffffff' }}>▶</span>
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: 15 }}>
              {p.timecode}
            </span>
            <span style={{ color: UI.textMuted }}>/ 03:30.33</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT_MONO, fontSize: 12 }}>
            <span>🔍 ━━●━━</span>
            <span>30 fps</span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 6,
                background: '#22252e',
                border: `1px solid ${UI.borderLight}`,
                color: '#f3f4f6',
              }}
            >
              CC 开启
            </span>
          </div>
        </div>

        {/* Ruler + Multi-Color Chapter Bar (matching screenshot!) */}
        <div
          style={{
            height: 32,
            display: 'flex',
            alignItems: 'center',
            borderBottom: `1px solid ${UI.border}`,
          }}
        >
          <div
            style={{
              width: 224,
              paddingLeft: 18,
              boxSizing: 'border-box',
              fontFamily: FONT_MONO,
              fontSize: 13,
              color: UI.textSecondary,
            }}
          >
            {p.timecode.slice(0, 8)}
          </div>
          <div style={{ flex: 1, position: 'relative', height: '100%', paddingRight: 18 }}>
            {/* Colorful Chapter Segment Line */}
            <div style={{ position: 'absolute', left: 0, right: 18, bottom: 0, height: 4, display: 'flex', gap: 2 }}>
              {[
                { w: '16%', c: '#f59e0b' },
                { w: '20%', c: '#3b82f6' },
                { w: '22%', c: '#22c55e' },
                { w: '22%', c: '#a855f7' },
                { w: '20%', c: '#ec4899' },
              ].map((ch, idx) => (
                <div key={idx} style={{ width: ch.w, height: '100%', background: ch.c, borderRadius: 2 }} />
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: UI.textMuted,
                paddingTop: 6,
              }}
            >
              {['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30'].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 6 Real OpenChatCut Tracks Area */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 0' }}>
          {/* Helper for Left Track Header */}
          {[
            {
              badge: '视频4',
              sub: 'V4 双语字幕...',
              isAudio: false,
              renderLane: () => (
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', gap: 4 }}>
                  {SUBTITLE_CLIPS.map((lbl, idx) => {
                    const visible = idx < p.v4Count;
                    return (
                      <div
                        key={lbl}
                        style={{
                          flex: 1,
                          height: '100%',
                          borderRadius: 6,
                          background: visible
                            ? idx === p.v4Count - 1
                              ? UI.clipVideoBright
                              : UI.clipVideo
                            : 'transparent',
                          border: visible ? '1px solid rgba(255,255,255,0.22)' : 'none',
                          boxShadow:
                            visible && idx === p.v4Count - 1
                              ? `0 0 18px ${UI.magenta}`
                              : undefined,
                          padding: '0 6px',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: '#fff',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          opacity: visible ? 1 : 0,
                        }}
                      >
                        {lbl}
                      </div>
                    );
                  })}
                </div>
              ),
            },
            {
              badge: '视频3',
              sub: 'V3 品牌主 Lo...',
              isAudio: false,
              renderLane: () => (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  {p.v3Progress > 0.01 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '4%',
                        width: `${p.v3Progress * 94}%`,
                        height: '100%',
                        borderRadius: 6,
                        background: `linear-gradient(90deg, ${UI.clipVideo}, #a83c78)`,
                        border: '1px solid rgba(255,255,255,0.24)',
                        padding: '0 14px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#ffffff',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span>✦ AstraArc 品牌主标志（中→左上→中）</span>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 11, opacity: 0.85 }}>03:15.05</span>
                    </div>
                  )}
                </div>
              ),
            },
            {
              badge: '视频2',
              sub: 'V2 核心原生...',
              isAudio: false,
              renderLane: () => (
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', gap: 4 }}>
                  {V2_CLIPS.map((lbl, idx) => {
                    const visible = idx < p.v2Count;
                    const isTrimmedTarget = idx === 4 && p.v2TrimGapOpen > 0.05;
                    return (
                      <div
                        key={lbl}
                        style={{
                          flex: isTrimmedTarget ? 1 + p.v2TrimGapOpen * 0.7 : 1,
                          height: '100%',
                          borderRadius: 6,
                          background: !visible
                            ? 'transparent'
                            : isTrimmedTarget
                              ? '#ef4444'
                              : idx === p.v2Count - 1
                                ? UI.clipVideoBright
                                : UI.clipVideo,
                          border: visible ? '1px solid rgba(255,255,255,0.24)' : 'none',
                          boxShadow:
                            visible && idx === p.v2Count - 1
                              ? `0 0 22px ${UI.magenta}`
                              : isTrimmedTarget
                                ? '0 0 18px rgba(239,68,68,0.85)'
                                : undefined,
                          padding: '0 6px',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#fff',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          opacity: visible ? 1 : 0,
                        }}
                      >
                        {isTrimmedTarget ? '✂ 冗余剔除' : lbl}
                      </div>
                    );
                  })}
                </div>
              ),
            },
            {
              badge: '视频1',
              sub: 'V1 星空宇宙...',
              isAudio: false,
              renderLane: () => (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  {p.v1Progress > 0.01 && (
                    <div
                      style={{
                        width: `${p.v1Progress * 100}%`,
                        height: '100%',
                        borderRadius: 6,
                        background: `linear-gradient(90deg, #b84280, ${UI.clipVideo})`,
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '0 14px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#ffffff',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span>星空宇宙背景舞台（全片连续）</span>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 11, opacity: 0.85 }}>03:30.33</span>
                    </div>
                  )}
                </div>
              ),
            },
            {
              badge: '音乐1',
              sub: 'A1 高管旁白...',
              isAudio: true,
              renderLane: () => (
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', gap: 4 }}>
                  {VO_CLIPS.map((vo, idx) => {
                    const visible = idx < p.a1Count;
                    return (
                      <div
                        key={vo.label}
                        style={{
                          flex: 1,
                          height: '100%',
                          borderRadius: 6,
                          background: visible
                            ? idx === p.a1Count - 1
                              ? UI.clipAudioBright
                              : UI.clipAudio
                            : 'transparent',
                          border: visible ? '1px solid rgba(255,255,255,0.2)' : 'none',
                          boxShadow:
                            visible && idx === p.a1Count - 1
                              ? `0 0 18px ${UI.emerald}`
                              : undefined,
                          padding: '0 5px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          fontSize: 9.5,
                          fontFamily: FONT_MONO,
                          fontWeight: 700,
                          color: '#062012',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          opacity: visible ? 1 : 0,
                        }}
                      >
                        <span style={{ color: '#ffffff' }}>{vo.label}</span>
                        <div style={{ display: 'flex', gap: 2, marginTop: 3, alignItems: 'flex-end', height: 10 }}>
                          {[0, 1, 2, 3, 4, 5].map((b) => (
                            <span
                              key={b}
                              style={{
                                width: 3,
                                height: 3 + ((idx * 3 + b * 5) % 8),
                                background: 'rgba(255,255,255,0.65)',
                                borderRadius: 1,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ),
            },
            {
              badge: '音乐2',
              sub: 'A2 Suno 交响...',
              isAudio: true,
              renderLane: () => (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  {p.a2Progress > 0.01 && (
                    <div
                      style={{
                        width: `${p.a2Progress * 100}%`,
                        height: '100%',
                        borderRadius: 6,
                        background: 'linear-gradient(90deg, #1f7a47, #2d9a5c)',
                        border: '1px solid rgba(255,255,255,0.22)',
                        padding: '0 10px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: 10,
                          top: 3,
                          fontSize: 10,
                          fontFamily: FONT_MONO,
                          fontWeight: 700,
                          color: '#ffffff',
                          zIndex: 2,
                        }}
                      >
                        ♪ Suno 史诗交响原声 (210s) + IMAX 拟音 (-16.0 LUFS)
                      </span>
                      {Array.from({ length: 110 }, (_, i) => {
                        const isBeat = i % 7 === 0 && p.beatMarkersProgress > i / 110;
                        const h = 8 + 26 * Math.abs(Math.sin(i * 0.45 + 0.8) * Math.cos(i * 0.17));
                        return (
                          <div
                            key={i}
                            style={{
                              width: 5,
                              height: isBeat ? Math.min(34, h + 10) : h,
                              marginTop: 10,
                              borderRadius: 2,
                              background: isBeat ? UI.goldBright : 'rgba(255,255,255,0.42)',
                              boxShadow: isBeat ? `0 0 10px ${UI.goldBright}` : undefined,
                              flexShrink: 0,
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              ),
            },
          ].map((track) => (
            <div
              key={track.badge}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                paddingRight: 18,
              }}
            >
              {/* Track Label Header Column */}
              <div
                style={{
                  width: 224,
                  padding: '0 14px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    width: 84,
                    padding: '4px 8px',
                    borderRadius: 7,
                    background: track.isAudio ? UI.trackAudioPill : UI.trackVideoPill,
                    color: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, lineHeight: 1.1 }}>{track.badge}</div>
                  <div
                    style={{
                      fontSize: 9,
                      opacity: 0.85,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginTop: 1,
                    }}
                  >
                    {track.sub}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 9, fontSize: 12, color: UI.textMuted }}>
                  <span>👁</span>
                  <span>🔊</span>
                  <span>🔒</span>
                  <span>🗑</span>
                </div>
              </div>

              {/* Track Clips Lane */}
              <div
                style={{
                  flex: 1,
                  height: '100%',
                  background: '#171920',
                  borderRadius: 6,
                  padding: 3,
                  boxSizing: 'border-box',
                }}
              >
                {track.renderLane()}
              </div>
            </div>
          ))}

          {/* Sweeping Glowing Orange Playhead */}
          <div
            style={{
              position: 'absolute',
              left: 224 + clamp(p.playheadPct) * (1514 - 242),
              top: -8,
              bottom: 0,
              width: 2.5,
              background: UI.playhead,
              boxShadow: `0 0 14px ${UI.playhead}`,
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: -6,
                top: -2,
                width: 14,
                height: 12,
                borderRadius: '3px 3px 6px 6px',
                background: UI.playhead,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
