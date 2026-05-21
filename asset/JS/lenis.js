// LENIS
const lenis = new Lenis({
  duration: 3,

  smoothWheel: true,

  wheelMultiplier: 0.8,

  touchMultiplier: 1.5,

  infinite: false,
});

function raf(time) {
  lenis.raf(time);

  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.lagSmoothing(0);
