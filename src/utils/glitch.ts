const GLITCH_CHARS = '!@#$%^&*[]|/?';

export function glitchText(text: string, intensity: number): string {
  return text
    .split('')
    .map((c) =>
      Math.random() < intensity
        ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        : c
    )
    .join('');
}

export function severityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return '#ff0000';
    case 'high':
      return '#ff9900';
    default:
      return '#ff6600';
  }
}
