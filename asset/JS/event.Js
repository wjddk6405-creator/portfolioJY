// 이벤트 페이지,배너 //
gsap.registerPlugin(ScrollTrigger);

/* =========================
   카드 등장 애니메이션
========================= */

gsap.utils.toArray(".diagCard").forEach((card) => {
  gsap.from(card, {
    y: 1000,
    rotate: -3,
    opacity: 0,

    ease: "none",

    scrollTrigger: {
      trigger: card,

      start: "top bottom",
      end: "top center",

      scrub: 8,
    },
  });
});

/* =========================
   거미 배경 애니메이션
========================= */

gsap.set(".spiderBg", {
  y: 0,
  opacity: 0,
  scale: 1,
  rotate: 0,
});

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".diagonalSection",

      start: "top",
      end: "bottom top",

      scrub: 3,
    },
  })

  .to(
    ".spiderBg",
    {
      opacity: 1,

      y: 350,

      scale: 1.05,

      rotate: 3,

      filter: "blur(0px)",

      ease: "none",
    },
    0,
  )
  .to(
    ".spiderBg",
    {
      opacity: 1,

      y: -800,

      scale: 1.05,

      rotate: 3,

      filter: "blur(0px)",

      ease: "none",
    },
    3.5,
  );

// 카드 hover 패널
const panel = document.querySelector(".detailPanel");
const panelImg = document.querySelector(".detailImg");
const panelNumber = document.querySelector(".detailNumber");

let allowHover = false;

// panel 초기 상태
gsap.set(panel, {
  opacity: 0,
  x: 50,
});

function showPanel() {
  // 기존에 돌고 있던 패널 애니메이션을 완전히 죽이고 새로 실행 (트윈 꼬임 방지)
  gsap.killTweensOf(panel);

  gsap.to(panel, {
    opacity: 1,
    x: 0,
    duration: 0.4,
    ease: "power2.out",
  });
}

function hidePanel() {
  // 기존 애니메이션을 완전히 죽이고 숨기기 실행
  gsap.killTweensOf(panel);

  gsap.to(panel, {
    opacity: 0,
    x: 50,
    duration: 0.3,
    ease: "power2.inOut",
  });
}

// hover 허용 조건 및 스크롤 감시 안전장치
window.addEventListener("scroll", () => {
  const firstCard = document.querySelector(".diagCard");
  if (!firstCard) return;

  const rect = firstCard.getBoundingClientRect();
  allowHover = rect.top < window.innerHeight * 0.6;

  // ★ 안전장치 1: 스크롤이 범위를 벗어나 호버 비허용 구역으로 가면 패널 강제 삭제
  if (!allowHover) {
    hidePanel();
  }
});

// 카드 hover 이벤트 바인딩
gsap.utils.toArray(".diagCard").forEach((card) => {
  const img = card.querySelector("img");
  const number = card.querySelector(".cardNumber");

  card.addEventListener("mouseenter", () => {
    if (!allowHover) return;

    // ★ 안전장치 2: 다른 카드에 진입할 때 혹시 남아있을지 모를 다른 카드의 zIndex 리셋
    gsap.utils.toArray(".diagCard").forEach((c) => gsap.set(c, { zIndex: 1 }));

    // 현재 카드 z-index 올리기
    gsap.set(card, { zIndex: 999 });

    panelImg.src = img.src;
    panelNumber.textContent = number.textContent;

    showPanel();
  });

  card.addEventListener("mouseleave", () => {
    gsap.set(card, { zIndex: 1 });
    hidePanel();
  });
});

// ★ 안전장치 3: 마우스가 윈도우(브라우저 화면) 밖으로 튕겨 나갔을 때도 확실하게 패널 숨기기
document.addEventListener("mouseleave", () => {
  hidePanel();
});

// 섹션타이틀 문구 //
gsap.set(".sectionTitle", {
  opacity: 0,
  y: 300,
});
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".diagonalSection",

      start: "top",
      end: "bottom top",
      ease: "power2.out",

      scrub: 1,
    },
  })
  .to(
    ".sectionTitle",
    {
      opacity: 1,
      y: 0,
    },
    3,
  )
  .to(".sectionTitle", {
    opacity: 0,
  });
// -------섹션타이틀 문구 ------//
// 카드 hover 패널 ////

// 포트폴리오 팝업 //
/* =========================
   VIEWER
========================= */

const viewerModal = document.querySelector(".viewerModal");
const viewerImg = document.querySelector(".viewerImg");
const viewerClose = document.querySelector(".viewerClose");

/* 카드 클릭 */
gsap.utils.toArray(".diagCard").forEach((card) => {
  const img = card.querySelector("img");

  card.addEventListener("click", () => {
    viewerModal.classList.add("active");
    document.body.classList.add("viewer-opened"); // 🔥 [추가] 뷰어 열릴 때 body에 클래스 추가 (메뉴 숨김용)

    viewerImg.src = img.src;

    // 배경 스크롤 막기
    document.body.style.overflow = "hidden";
  });
});

/* 닫기 */
function closeViewer() {
  viewerModal.classList.remove("active");
  document.body.classList.remove("viewer-opened"); // 🔥 [추가] 뷰어 닫힐 때 body에서 클래스 제거 (메뉴 복구용)

  document.body.style.overflow = "";
}

/* X 버튼 */
viewerClose.addEventListener("click", closeViewer);

/* 배경 클릭 (이미지 영역 외에 어디를 누르든 닫히게 설정) */
viewerModal.addEventListener("click", (e) => {
  // 클릭된 요소가 '이미지(viewerImg)'가 아니고, '닫기 버튼(viewerClose)'도 아니라면 닫기 실행
  if (e.target !== viewerImg && e.target !== viewerClose) {
    closeViewer();
  }
});

/* ESC 닫기 */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeViewer();
  }
});

// viewer 활성화 시 메뉴 버튼 숨김//
/* ==========================================================================
   스크롤 시 햄버거 메뉴 버튼 보이게/숨기게 제어 (안전장치 추가)
   ========================================================================== */
window.addEventListener("scroll", () => {
  const menuBtn = document.querySelector(".menu-open-btn");
  if (!menuBtn) return;

  // 뷰어가 열려있을 때는 이 스크롤 로직이 방해하지 않도록 차단
  if (document.body.classList.contains("viewer-opened")) return;

  // 예: 스크롤이 200px 이상 내려가면 메뉴 버튼 보이게 하기
  if (window.scrollY > 200) {
    menuBtn.style.opacity = "1";
    menuBtn.style.visibility = "visible";
  } else {
    // 다시 맨 위로 올라가면 메인 화면 컨셉에 맞춰 숨김
    menuBtn.style.opacity = "0";
    menuBtn.style.visibility = "hidden";
  }
});
/* viewer 활성화 시 메뉴 버튼 숨김 */
// 포트폴리오 Viewer
