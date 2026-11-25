export const FPS = 30;
export const DURATION_IN_FRAMES = 900; // 30.0s @ 30fps, 1920x1080

export const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp(t);

export const ease = (t: number) => {
  const x = clamp(t);
  return x * x * x * (10 + x * (-15 + 6 * x));
};

export const easeOutExpo = (t: number) => {
  const x = clamp(t);
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
};

export const spring = (sec: number) =>
  sec < 0
    ? 0
    : 1 - Math.exp(-9 * sec) * (Math.cos(14 * sec) + (9 / 14) * Math.sin(14 * sec));

export const FONT_SANS =
  "'PingFang SC', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Hiragino Sans GB', 'Helvetica Neue', sans-serif";
export const FONT_SERIF =
  "'Songti SC', 'Georgia', 'Times New Roman', serif";
export const FONT_MONO =
  "'SF Mono', 'JetBrains Mono', ui-monospace, Menlo, monospace";

export const UI = {
  // Exact OpenChatCut Pro Dark NLE Palette (from real UI screenshot)
  bgApp: '#0f1013',
  bgHeader: '#141519',
  bgPanel: '#131418',
  bgSurface: '#191b20',
  bgCard: '#1e2027',
  bgMonitor: '#08090c',
  border: '#272932',
  borderLight: '#353844',
  textPrimary: '#f4f4f6',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',

  // Signature OpenChatCut Track & Accent Colors
  trackVideoPill: '#3b82f6',
  trackAudioPill: '#d97706',
  clipVideo: '#c04b88',
  clipVideoBright: '#e062a3',
  clipAudio: '#2d9a5c',
  clipAudioBright: '#34d399',
  exportOrange: '#e88b35',
  playhead: '#f97316',

  // AstraArc Polaris Brand Accents (from AstraArc_Partners_Native_v5.ccproj)
  gold: '#ead1a0',
  goldBright: '#f6c95b',
  emerald: '#34d399',
  cyan: '#38bdf8',
  violet: '#a855f7',
  magenta: '#ec4899',
  coral: '#fb7185',
};

export interface WorkflowPlugin {
  id: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
  yCenter: number; // approximate stage Y for laser beam origin
}

export const WORKFLOW_PLUGINS: WorkflowPlugin[] = [
  {
    id: 'voice-cut',
    icon: '✂',
    title: '口播净剪',
    desc: '去停顿、赘词并同步字幕',
    color: UI.emerald,
    yCenter: 288,
  },
  {
    id: 'motion-pack',
    icon: '🎞',
    title: '动态包装',
    desc: '标题、数据卡与转场动效',
    color: UI.magenta,
    yCenter: 368,
  },
  {
    id: 'highlight',
    icon: '🎬',
    title: '长片拆条',
    desc: '提炼高光并重排为短视频',
    color: UI.cyan,
    yCenter: 448,
  },
  {
    id: 'story',
    icon: '✦',
    title: '产品故事',
    desc: '围绕卖点组织脚本和镜头',
    color: UI.goldBright,
    yCenter: 528,
  },
  {
    id: 'ai-vision',
    icon: '▣',
    title: 'AI 影像',
    desc: '从概念生成镜头与声音',
    color: UI.violet,
    yCenter: 608,
  },
  {
    id: 'knowledge',
    icon: '▶',
    title: '知识成片',
    desc: '把主题整理成清晰讲解',
    color: UI.coral,
    yCenter: 688,
  },
];

export interface AssetFolder {
  id: string;
  name: string;
  count: string;
  color: string;
  cx: number;
  cy: number;
}

export const ASSET_FOLDERS: AssetFolder[] = [
  { id: 'mg', name: '01 原生 JSX 动效', count: '34 组', color: UI.magenta, cx: 472, cy: 360 },
  { id: 'plates', name: '02 电影级视觉底板', count: '18 张', color: UI.violet, cx: 616, cy: 360 },
  { id: 'clips', name: '03 Motion 实拍案例', count: '9 条', color: UI.cyan, cx: 760, cy: 360 },
  { id: 'logos', name: '04 品牌 / 团队 Logo', count: '31 枚', color: UI.goldBright, cx: 472, cy: 492 },
  { id: 'vo', name: '05 高管旁白分句', count: '26 轨', color: UI.emerald, cx: 616, cy: 492 },
  { id: 'music', name: '06 交响配乐 & IMAX', count: '6 轨', color: UI.exportOrange, cx: 760, cy: 492 },
];

export const V2_CLIPS = [
  'Act1 · SHIFT 序幕',
  'S02 · 竞争格局',
  'S03 · 战略拐点',
  'S04 · AstraArc 登场',
  'Act2 · 白模→成图',
  'S08 · 空间精工',
  'S09 · 3D 洞石展台',
  'S10 · 品牌工艺',
  'Act3 · 16屏矩阵',
  'Act3 · S14A 甘特图',
  'S15 · 电影光学',
  'S16 · AI 机械臂',
  'Act4 · 光学棱镜',
  'S20 · 硅基穹顶',
  'S21 · 知识图谱',
  'S22 · 实战案例',
  'Act5 · 终幕光弧',
  'S26 · 品牌收尾',
];

export const SUBTITLE_CLIPS = [
  '字幕 S01 商业变化',
  '字幕 S02 客户诉求',
  '字幕 S03 战略方向',
  '字幕 S04 北迹星诞生',
  '字幕 S05 融合创新',
  '字幕 S07 Design',
  '字幕 S09 空间重塑',
  '字幕 S11 创意落地',
  '字幕 S13 Motion',
  '字幕 S15 电影级表达',
  '字幕 S18 Intel',
  '字幕 S20 智能工作流',
  '字幕 S23 全链赋能',
  '字幕 S25 AstraArc',
  '字幕 S26 真正发生',
];

export const VO_CLIPS = Array.from({ length: 18 }, (_, i) => ({
  label: `VO S${String(i + 1).padStart(2, '0')}`,
  dur: `00:${String(6 + ((i * 5) % 11)).padStart(2, '0')}`,
}));

export const PIPELINE_STAGES = [
  { id: 'story', num: '01', label: '脚本拆镜', plugin: '产品故事', color: UI.goldBright, start: 1.5 },
  { id: 'voice', num: '02', label: '口播净剪', plugin: '26轨去气口', color: UI.emerald, start: 3.4 },
  { id: 'vision', num: '03', label: 'AI 影像', plugin: '白模→电影成图', color: UI.violet, start: 7.8 },
  { id: 'jsx', num: '04', label: '动态包装', plugin: '34×JSX并发', color: UI.magenta, start: 12.6 },
  { id: 'sub', num: '05', label: '字幕精校', plugin: '⌘Z自动纠错', color: UI.cyan, start: 18.2 },
  { id: 'mix', num: '06', label: 'IMAX 混音', plugin: '鼓点全锁成片', color: UI.exportOrange, start: 20.6 },
];
