/**
 * Purple-themed confetti burst for blame assignments.
 */
import confetti from 'canvas-confetti';

/** Default purple confetti when blame is assigned */
export function firePurpleConfetti() {
  const purpleColors = ['#cc44ff', '#9900cc', '#ff66ff', '#7700aa', '#dd88ff'];

  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.55 },
    colors: purpleColors,
    gravity: 0.9,
    scalar: 1.1,
    ticks: 120,
  });
}

/** Big celebration burst for achievements */
export function fireAchievementConfetti() {
  const colors = ['#cc44ff', '#ff0066', '#00ffff', '#ffcc00', '#ff66ff'];
  const end = Date.now() + 800;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
