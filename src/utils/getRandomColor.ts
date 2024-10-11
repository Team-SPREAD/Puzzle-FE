// utils/colorUtils.ts

type RGB = {
  r: number;
  g: number;
  b: number;
};

/**
 * HEX 색상을 RGB 객체로 변환합니다.
 */
function hexToRgb(hex: string): RGB | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * RGB 객체를 HSL 문자열로 변환합니다.
 */
function rgbToHsl(rgb: RGB): string {
  let { r, g, b } = rgb;
  r /= 255, g /= 255, b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h! /= 6;
  }

  return `hsl(${Math.round(h! * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

/**
 * 색상 문자열을 표준화합니다.
 */
export function standardizeColor(color: string): string {
  if (typeof window !== 'undefined') {
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      return ctx.fillStyle;
    }
  }
  return color; // 서버 사이드에서는 원래 색상을 반환
}

/**
 * 대비되는 색상(검정 또는 흰색)을 반환합니다.
 */
export function getContrastingColor(color: string): string {
  const standardColor = standardizeColor(color);
  const rgb = hexToRgb(standardColor);
  
  if (!rgb) return '#000000'; // 기본값으로 검정색 반환

  const { r, g, b } = rgb;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

/**
 * 랜덤한 HSL 색상을 생성합니다.
 */
export function generateRandomColor(): string {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 30) + 60;
  const l = Math.floor(Math.random() * 20) + 40;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * HSL 색상의 명도를 조정합니다.
 */
export function adjustColor(color: string, amount: number): string {
  const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return color;

  let [, h, s, l] = match.map(Number);
  l = Math.max(0, Math.min(100, l + amount));

  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * 주어진 색상에 대해 다양한 정보를 반환합니다.
 */
export function getColorInfo(color: string) {
  const standardColor = standardizeColor(color);
  const rgb = hexToRgb(standardColor);
  
  if (!rgb) return null;

  const hsl = rgbToHsl(rgb);
  const contrastColor = getContrastingColor(standardColor);

  return {
    hex: standardColor,
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl,
    contrastColor
  };
}