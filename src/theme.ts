export const FPS = 30;
export const DURATION_IN_FRAMES = 900; // 30.0s @ 30fps

export const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp(t);

export const ease = (t: number) => {
  const x = clamp(t);
  return x * x * x * (10 + x * (-15 + 6 * x));
};

export const easeOutBack = (t: number) => {
  const x = clamp(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export const spring = (sec: number) =>
  sec < 0
    ? 0
    : 1 - Math.exp(-8.5 * sec) * (Math.cos(13.5 * sec) + (8.5 / 13.5) * Math.sin(13.5 * sec));

export const FONT_SANS =
  "'PingFang SC', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Hiragino Sans GB', 'Helvetica Neue', sans-serif";
export const FONT_MONO =
  "'SF Mono', 'JetBrains Mono', ui-monospace, Menlo, monospace";

export const COLORS = {
  paper: '#f7f3ea',
  paperCard: '#fffdf8',
  paperSoft: '#efe9dc',
  ink: '#2b2420',
  inkSoft: '#6d6259',
  // AstraArc Polaris brand accents (from AstraArc_Partners_Native_v5.ccproj)
  polarisNavy: '#1b2640',
  polarisDeep: '#090d18',
  polarisGold: '#ead1a0',
  polarisGoldBright: '#f6c95b',
  polarisEmerald: '#34d399',
  polarisCoral: '#de6e56',
  polarisSky: '#58b4e8',
  polarisLavender: '#a999f0',
  playheadRed: '#e5484d',
};

export type ClipId =
  | 'dusk'
  | 'clay'
  | 'space'
  | 'matrix'
  | 'prism'
  | 'finale';

export interface ClipMeta {
  id: ClipId;
  name: string;
  shortName: string;
  durationLabel: string;
  act: string;
  accent: string;
}

export const CLIPS: Record<ClipId, ClipMeta> = {
  dusk: {
    id: 'dusk',
    name: 'Act1_暮色地标.jpg',
    shortName: '暮色地标.jpg',
    durationLabel: '3.2s',
    act: 'ACT 1',
    accent: '#58b4e8',
  },
  clay: {
    id: 'clay',
    name: 'Act2_白模停顿.mp4',
    shortName: '白模停顿.mp4',
    durationLabel: '2.1s',
    act: 'DRAFT',
    accent: '#9ca3af',
  },
  space: {
    id: 'space',
    name: 'Act2_空间成图.jpg',
    shortName: '空间成图.jpg',
    durationLabel: '3.4s',
    act: 'ACT 2',
    accent: '#ead1a0',
  },
  matrix: {
    id: 'matrix',
    name: 'Act3_16屏矩阵.mp4',
    shortName: '16屏矩阵.mp4',
    durationLabel: '3.8s',
    act: 'ACT 3',
    accent: '#34d399',
  },
  prism: {
    id: 'prism',
    name: 'Act4_光学棱镜.jpg',
    shortName: '光学棱镜.jpg',
    durationLabel: '3.0s',
    act: 'ACT 4',
    accent: '#a999f0',
  },
  finale: {
    id: 'finale',
    name: 'Act5_光弧终幕.jpg',
    shortName: '光弧终幕.jpg',
    durationLabel: '4.0s',
    act: 'ACT 5',
    accent: '#f6c95b',
  },
};

export const TRANSITIONS = [
  { id: 'star', name: '星芒推进', icon: '✦', bg: '#fef3c7' },
  { id: 'arc', name: '光弧叠化', icon: '◠', bg: '#e0f2fe' },
  { id: 'imax', name: 'IMAX扫频', icon: '⚡', bg: '#f3e8ff' },
  { id: 'zoom', name: '空间推镜', icon: '⊕', bg: '#dcfce7' },
  { id: 'slide', name: '丝绒滑动', icon: '➜', bg: '#ffe4e6' },
  { id: 'flash', name: '闪白卡点', icon: '✧', bg: '#fef9c3' },
];

export const TEXT_PRESETS = [
  { id: 'title', label: 'AstraArc 北迹星', tag: '主标题', bg: '#1b2640', fg: '#ead1a0' },
  { id: 'sub', label: '让更好的商业想象发生', tag: '金句字幕', bg: '#fff3d6', fg: '#2b2420' },
  { id: 'badge', label: 'AI 战略 · 设计 · 智造', tag: '霓虹标签', bg: '#090d18', fg: '#34d399' },
];
