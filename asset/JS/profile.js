(function () {
  try {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      const profileTL = gsap.timeline({
        scrollTrigger: {
          trigger: ".profile",
          start: "top 70%",
          toggleActions: "restart reset restart reset",
        },
      });

      profileTL.to(".profile .title_left > h1, .profile .title_left > h3, .profile .title_right", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });

      profileTL.to(
        ".profile .box_left .profileimgBox, .profile .profile_info > div, .profile .box_right",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.4",
      );

      // 네비 이동 시 강제 새로고침
      document.addEventListener("click", (e) => {
        if (e.target.closest(".menu-link-item")) {
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 800);
        }
      });
    }
  } catch (e) {
    console.error("profile.js 에러:", e);
  }
})();
