/* ==========================================================================
   [완벽 종결 통합본] 직접 스크롤 + 메뉴 클릭 시 거미 완벽 연동 nav.js
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
      if (link.classList.contains("portfolio-toggle-btn")) return;

      link.addEventListener("click", (e) => {
        e.preventDefault();

        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const targetSection = document.querySelector(targetId);

        if (fullMenuLayer) {
          fullMenuLayer.classList.remove("menu-active");
        }
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";

        const isMain = targetId === "#main" || targetId === "#mainSection";
        const isProfile = targetId === "#profileSection";
        const isEvent = targetId === "#eventSection";

        // --------------------------------------------------------------------
        // A. 목적지 좌표 구하기
        // --------------------------------------------------------------------
        let finalScrollTop = 0;
        if (!isMain && targetSection) {
          const scrollTopOffset = window.pageYOffset || document.documentElement.scrollTop;
          const targetRectTop = targetSection.getBoundingClientRect().top;

          finalScrollTop = scrollTopOffset + targetRectTop;

          if (isProfile) {
            finalScrollTop += 800;
          }

          if (isEvent) {
            finalScrollTop -= 120;
          }
        }

        // --------------------------------------------------------------------
        // B. ScrollTrigger 애니메이션 안전 상태 동기화
        // --------------------------------------------------------------------
        try {
          if (typeof ScrollTrigger !== "undefined" && ScrollTrigger.getAll) {
            ScrollTrigger.getAll().forEach((trigger) => {
              if (isMain || isProfile) {
                if (
                  isProfile &&
                  (trigger.trigger === targetSection ||
                    (targetSection && targetSection.contains(trigger.trigger)))
                ) {
                  if (trigger.animation) trigger.animation.progress(1).play();
                } else {
                  if (trigger.animation) trigger.animation.progress(0).pause();
                }
              } else {
                if (
                  trigger.trigger === targetSection ||
                  (targetSection && targetSection.contains(trigger.trigger))
                ) {
                  if (trigger.animation) trigger.animation.progress(1).play();
                } else {
                  if (trigger.animation) {
                    trigger.animation.progress(0).pause();
                  }
                }
              }
            });

            ScrollTrigger.refresh();
          }
        } catch (stError) {
          console.warn("ScrollTrigger 최적화 우회:", stError);
        }

        // --------------------------------------------------------------------
        // C. 스크롤 엔진 가동
        // --------------------------------------------------------------------
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

        // 스크롤 안착 후 안정화 새로고침
        setTimeout(() => {
          try {
            if (typeof ScrollTrigger !== "undefined" && ScrollTrigger.refresh) {
              ScrollTrigger.refresh();
            }
          } catch (e) {}
        }, 900);
      });
    });

    // ==========================================================================
    // [기능 4] 포트폴리오 대메뉴 클릭 시 소분류 메뉴 부드럽게 토글(Toggle)
    // ==========================================================================
    const portfolioContainer = document.querySelector(".portfolio-menu-container");
    const portfolioToggleBtn = document.querySelector(".portfolio-toggle-btn");

    if (portfolioToggleBtn && portfolioContainer) {
      portfolioToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        portfolioContainer.classList.toggle("active");
      });
    }

    // ==========================================================================
    // [기능 5] 스크롤 실시간 감시 시스템 (휠 스크롤 / 메뉴 클릭 둘 다 완벽 대응)
    // ==========================================================================
    if (typeof ScrollTrigger !== "undefined" && typeof gsap !== "undefined") {
      // 5-A. 메인 화면에서 햄버거 메뉴 보이기/숨기기 컨트롤
      ScrollTrigger.create({
        trigger: "#main",
        start: "bottom top",
        onEnter: () => {
          gsap.to(".menu-open-btn", { opacity: 0.3, visibility: "visible", duration: 0.3 });
        },
        onLeaveBack: () => {
          gsap.to(".menu-open-btn", { opacity: 0, visibility: "hidden", duration: 0.3 });
        },
      });

      // 5-B. ★ [실시간 거미 부활/격리 위성]
      // 프로필 섹션을 지나 포트폴리오 영역(event)으로 휠을 내려가거나 올라올 때 실시간 감시합니다.
      ScrollTrigger.create({
        trigger: "#eventSection",
        start: "top bottom", // 이벤트 섹션의 꼭대기가 브라우저 화면 맨 밑바닥에 걸치기 시작할 때
        onEnter: () => {
          // 아래로 휠 굴려 내려갈 때 거미 즉시 렌더링 부활
          const spider = document.querySelector(".spiderBg");
          if (spider) {
            spider.style.setProperty("content-visibility", "visible", "important");
            spider.style.setProperty("opacity", "1", "important");
            spider.style.setProperty("visibility", "visible", "important");
          }
        },
        onLeaveBack: () => {
          // 위로 휠 굴려 올라가서 프로필/메인 영역으로 도망칠 때 거미 완전 증발 (잔상 박멸)
          const spider = document.querySelector(".spiderBg");
          if (spider) {
            spider.style.setProperty("content-visibility", "hidden", "important");
            spider.style.setProperty("opacity", "0", "important");
          }
        },
      });
    }
  } catch (globalError) {
    console.error("nav.js 에러 방어 시스템 가동:", globalError);
  }
})();
