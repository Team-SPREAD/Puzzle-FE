export function formatDuration(joinedAt: number) {
  const duration = Date.now() - joinedAt;
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${String(hours).padStart(2, '0')}h 
    ${String(minutes % 60).padStart(2, '0')}m 
    ${String(seconds % 60).padStart(2, '0')}s`;
}
