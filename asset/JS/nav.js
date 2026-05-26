/* ==========================================================================
   [수정본] 오직 네비게이션 메뉴 및 페이지 스크롤만 제어하는 nav.js
   ========================================================================== */
(function () {
  try {
    const menuOpenBtn =
      document.getElementById("menuOpenBtn") || document.querySelector(".menu-open-btn");
    const menuCloseBtn =
      document.getElementById("menuCloseBtn") || document.querySelector(".menu-close-btn");
    const fullMenuLayer =
      document.getElementById("fullMenuLayer") || document.querySelector(".full-menu-layer");
    const menuLinkItems = document.querySelectorAll(".menu-link-item");

    // [기능 1] 메뉴 열기
    if (menuOpenBtn && fullMenuLayer) {
      menuOpenBtn.addEventListener("click", () => {
        fullMenuLayer.classList.add("menu-active");
        document.body.style.overflow = "hidden";
      });
    }

    // [기능 2] 메뉴 닫기
    if (menuCloseBtn && fullMenuLayer) {
      menuCloseBtn.addEventListener("click", () => {
        fullMenuLayer.classList.remove("menu-active");
        document.body.style.overflow = "";
      });
    }

    // [기능 3] 메뉴 링크 클릭 및 스크롤 강제 제어
    menuLinkItems.forEach((link) => {
      const linkText = link.textContent.trim().toUpperCase();
      const linkHref = link.getAttribute("href");

      // ★ PORTFOLIO 대메뉴는 스크롤바 이동 대상에서 완벽히 제외 (서브메뉴 먹통 방지 치트키)
      if (
        link.classList.contains("portfolio-toggle-btn") ||
        linkText.includes("PORTFOLIO") ||
        !linkHref ||
        linkHref === "#"
      ) {
        return;
      }

      link.addEventListener("click", (e) => {
        e.preventDefault();

        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        if (fullMenuLayer) {
          fullMenuLayer.classList.remove("menu-active");
        }
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";

        const isMain = targetId === "#main" || targetId === "#mainSection";
        const isProfile = targetId.toLowerCase().includes("profile");
        const isEvent = targetId.toLowerCase().includes("event");
        const isVideo = targetId.toLowerCase().includes("video");
        const isWeb = targetId.toLowerCase().includes("web");
        const isContact = targetId.toLowerCase().includes("contact");

        // A. 목적지 좌표 구하기
        const scrollTopOffset = window.pageYOffset || document.documentElement.scrollTop;
        const targetRectTop = targetSection.getBoundingClientRect().top;
        let finalScrollTop = scrollTopOffset + targetRectTop;

        if (!isMain) {
          if (isProfile) finalScrollTop += 800;
          if (isEvent) finalScrollTop -= 120;
          if (isVideo) finalScrollTop += 600;
          if (isWeb) finalScrollTop += 0;
          if (isContact) finalScrollTop += 1300;
        }

        // B. ScrollTrigger 간섭 제거
        try {
          if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.update();
          }
        } catch (stError) {
          console.warn("ScrollTrigger 갱신 우회:", stError);
        }

        // C. 스크롤 엔진 가동
        setTimeout(() => {
          try {
            if (typeof lenis !== "undefined" && lenis.scrollTo) {
              lenis.scrollTo(finalScrollTop, { duration: 0.8, immediate: false, force: true });
            } else if (window.lenis && window.lenis.scrollTo) {
              window.lenis.scrollTo(finalScrollTop, { duration: 0.8, force: true });
            } else if (typeof gsap !== "undefined" && gsap.to) {
              gsap.to(window, {
                scrollTo: { y: finalScrollTop, autoKill: false },
                duration: 0.7,
                ease: "power2.out",
              });
            } else {
              window.scrollTo({ top: finalScrollTop, behavior: "smooth" });
            }
          } catch (scrollError) {
            window.scrollTo(0, finalScrollTop);
          }
        }, 80);

        setTimeout(() => {
          try {
            if (typeof ScrollTrigger !== "undefined" && ScrollTrigger.refresh) {
              ScrollTrigger.refresh();
            }
          } catch (e) {}
        }, 900);
      });
    });

    // [기능 4] 포트폴리오 대메뉴 클릭 시 소분류 메뉴 토글
    const portfolioContainer =
      document.querySelector(".portfolio-menu-container") ||
      document.querySelector(".full-menu-layer");
    const portfolioToggleBtn =
      document.querySelector(".portfolio-toggle-btn") ||
      document.querySelector(".menu-link-item:nth-child(3)") ||
      [...document.querySelectorAll(".menu-link-item")].find((el) =>
        el.textContent.includes("PORTFOLIO"),
      );

    if (portfolioToggleBtn && portfolioContainer) {
      portfolioToggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        portfolioContainer.classList.toggle("active");
      });
    }

    // [기능 5] 스크롤 실시간 감시 시스템 (거미 실시간 노출 분기)
    if (typeof ScrollTrigger !== "undefined" && typeof gsap !== "undefined") {
      ScrollTrigger.create({
        trigger: "#main",
        start: "bottom top",
        onEnter: () => {
          document.body.classList.add("scrolled-past-main");
          gsap.to(".menu-open-btn", { opacity: 0.3, visibility: "visible", duration: 0.3 });
        },
        onLeaveBack: () => {
          document.body.classList.remove("scrolled-past-main");
          gsap.to(".menu-open-btn", { opacity: 0, visibility: "hidden", duration: 0.3 });
        },
      });

      ScrollTrigger.create({
        trigger: "#eventSection",
        start: "top bottom",
        onEnter: () => {
          const spider = document.querySelector(".spiderBg");
          if (spider) {
            spider.style.setProperty("content-visibility", "visible", "important");
            spider.style.setProperty("opacity", "1", "important");
            spider.style.setProperty("visibility", "visible", "important");
          }
        },
        onLeaveBack: () => {
          const spider = document.querySelector(".spiderBg");
          if (spider) {
            spider.style.setProperty("content-visibility", "hidden", "important");
            spider.style.setProperty("opacity", "0", "important");
          }
        },
      });
    }
  } catch (globalError) {
    console.error("nav.js 에러:", globalError);
  }
})();
// nav.js
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault(); // 1. 기본 링크 이동 동작을 막고

    const targetId = this.getAttribute("href"); // 2. 이동할 섹션 ID를 찾음
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      // 3. Lenis를 사용하여 타겟 섹션으로 부드럽게 스크롤
      // (lenis 변수가 전역에 선언되어 있어야 함. 만약 안 된다면 아래 팁 참고)
      window.lenis.scrollTo(targetSection);
    }
  });
});
// asset/JS/nav.js

window.addEventListener("load", () => {
  // 네비게이션 링크들을 모두 찾습니다.
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // 기본 이동(점프)을 막습니다.

      const targetId = this.getAttribute("href"); // #webSection 같은 ID를 가져옴
      const targetElement = document.querySelector(targetId);

      if (targetElement && window.lenis) {
        // Lenis의 scrollTo 기능을 사용해 부드럽게 이동
        window.lenis.scrollTo(targetElement, {
          offset: 0,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    });
  });
});
