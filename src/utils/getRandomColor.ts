// utils/colorUtils.ts

/**
 * 랜덤한 색상을 생성합니다.
 * @returns {string} HSL 형식의 색상 문자열
 */
export function generateRandomColor(): string {
    // 색조(Hue)는 0-360 사이의 랜덤한 값
    const hue = Math.floor(Math.random() * 360);
    
    // 채도(Saturation)는 60-90% 사이로 제한하여 선명한 색상을 생성합니다.
    const saturation = Math.floor(Math.random() * 30) + 60;
    
    // 명도(Lightness)는 40-60% 사이로 제한하여 너무 어둡거나 밝지 않게 합니다.
    const lightness = Math.floor(Math.random() * 20) + 40;
  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  
  /**
   * 주어진 색상의 대비색을 생성합니다.
   * @param {string} color - HSL 형식의 색상 문자열
   * @returns {string} 대비되는 색상 (검정 또는 흰색)
   */
  export function getContrastColor(color: string): string {
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return '#000000';  // 기본값으로 검정색 반환
  
    const lightness = parseInt(match[3]);
    return lightness > 50 ? '#000000' : '#FFFFFF';
  }
  
  /**
   * 주어진 색상을 밝게 또는 어둡게 만듭니다.
   * @param {string} color - HSL 형식의 색상 문자열
   * @param {number} amount - 조정할 양 (-100 to 100)
   * @returns {string} 조정된 HSL 색상 문자열
   */
  export function adjustColor(color: string, amount: number): string {
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return color;  // 매칭 실패 시 원본 색상 반환
  
    let h = parseInt(match[1]);
    let s = parseInt(match[2]);
    let l = parseInt(match[3]);
  
    l = Math.max(0, Math.min(100, l + amount));
  
    return `hsl(${h}, ${s}%, ${l}%)`;
  }