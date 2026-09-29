export interface ThemeConfig {
  accent: string;
  canvas: string;
  surface: string;
  ink: string;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  accent: "#0E52FF",
  canvas: "#F8F9FA",
  surface: "#FFFFFF",
  ink: "#111215",
};

export const THEME_PRESETS: { name: string; colors: ThemeConfig }[] = [
  { name: "Cobalt", colors: DEFAULT_THEME_CONFIG },
  { name: "Emerald", colors: { accent: "#047857", canvas: "#F6FAF8", surface: "#FFFFFF", ink: "#10221B" } },
  { name: "Violet", colors: { accent: "#6D28D9", canvas: "#F9F7FC", surface: "#FFFFFF", ink: "#21182E" } },
  { name: "Crimson", colors: { accent: "#B42335", canvas: "#FCF8F8", surface: "#FFFFFF", ink: "#281619" } },
];

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  const [red, green, blue] = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

export function validateTheme(value: unknown): value is ThemeConfig {
  if (!value || typeof value !== "object") return false;
  const colors = value as Record<string, unknown>;
  if (!["accent", "canvas", "surface", "ink"].every((key) => typeof colors[key] === "string" && HEX_COLOR.test(colors[key] as string))) return false;
  const theme = colors as unknown as ThemeConfig;
  // Buttons use white text. Keep custom accent dark enough to remain readable.
  if ((1.05 / (luminance(theme.accent) + 0.05)) < 4.5) return false;
  if (((luminance(theme.surface) + 0.05) / (luminance(theme.ink) + 0.05)) < 4.5) return false;
  if (((luminance(theme.canvas) + 0.05) / (luminance(theme.ink) + 0.05)) < 4.5) return false;
  return true;
}

export function normalizeTheme(value: unknown): ThemeConfig {
  return validateTheme(value) ? value : DEFAULT_THEME_CONFIG;
}
