const lenis = new Lenis({
  duration: 1.2, // Adjusts smoothness (higher = smoother)
  smooth: true,
  wheelMultiplier: 0.8, // Scroll speed
  ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
});

// Animation loop to update Lenis
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Optionally listen for scroll events
window.addEventListener("scroll", () => {
  lenis.scroll;
});
