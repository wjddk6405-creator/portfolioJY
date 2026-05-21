// ---------------- GSAP ----------------

gsap.registerPlugin(ScrollTrigger);

gsap.set(".workSvg", {
  scale: 0.5,
  opacity: 0,
  y: 100,

  transformOrigin: "center center",
});

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".myWorkSection",
    start: "top top",
    end: "bottom bottom",
    scrub: 2,
    pin: true,
  },
});

// 등장
tl.to(".workSvg", {
  scale: 1,
  duration: 1,
  ease: "power3.out",
})

  .to(
    ".workSvg",
    {
      opacity: 1,
      duration: 2,
      ease: "power2.out",
    },
    0,
  )

  // 이후 커지면서 사라짐
  .to(".workSvg", {
    scale: 30,
    opacity: 0,
    duration: 2,
    ease: "none",
  });
