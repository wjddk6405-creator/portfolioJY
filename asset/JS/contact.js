/* ==========================================================================
   CONTACT 섹션 - 스크롤 감동 연동 + 버튼 클릭 토글 (최종 통합 완벽본)
   ========================================================================== */

// 1. 요소 가져오기 및 초기 세팅
const contactH1 = document.querySelector(".contact_section > h1");
const contactBtn = document.querySelector(".contact_btn");
const contactInfoWrap = document.querySelector(".contact_info_wrap");

gsap.set(contactH1, { opacity: 0, y: 250 });
gsap.set(contactBtn, { opacity: 0, y: 0 });

// 정보창이 열려있는지 체크하는 자물쇠 변수
let isInfoOpen = false;

// 2. 마우스 스크롤 실시간 연동 영역
window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY + window.innerHeight;
  const totalHeight = document.documentElement.scrollHeight;

  const animationStartZone = totalHeight - 800;
  const animationEndZone = totalHeight;

  if (currentScroll >= animationStartZone) {
    let progress = (currentScroll - animationStartZone) / (animationEndZone - animationStartZone);
    if (progress > 1) progress = 1;

    // CONTACT 글자 상승
    gsap.to(contactH1, {
      opacity: progress,
      y: 250 - 250 * progress,
      duration: 0.5,
      ease: "power1.out",
    });

    // MESSAGE 버튼 페이드인 (정보창이 이미 열려있을 때는 스크롤이 흔들려도 강제 고정)
    let btnProgress = (progress - 0.55) * 2.22;
    if (btnProgress < 0) btnProgress = 0;
    if (btnProgress > 1) btnProgress = 1;

    gsap.to(contactBtn, {
      opacity: isInfoOpen ? 1 : btnProgress, // ◀ 정보창이 열려있다면 투명도 1로 강제 고정해 꿈틀거림 방지
      y: 0,
      duration: 0.5,
      ease: "power1.out",
    });
  } else {
    // 사용자가 다시 위로 스크롤을 완전히 올렸을 때만 리셋
    gsap.to(contactH1, { opacity: 0, y: 250, duration: 0.3 });
    gsap.to(contactBtn, { opacity: 0, y: 0, duration: 0.3 });

    // 다른 섹션으로 도망가면 열려있던 창 닫기
    if (contactInfoWrap && contactInfoWrap.classList.contains("show")) {
      contactInfoWrap.classList.remove("show");
      isInfoOpen = false; // 자물쇠 해제
    }
  }
});

// 3. MESSAGE 버튼 클릭 이벤트 영역 (안전장치 강화)
if (contactBtn && contactInfoWrap) {
  contactBtn.addEventListener("click", (e) => {
    e.preventDefault(); // 브라우저 기본 동작 방지
    e.stopPropagation(); // 이벤트가 위로 퍼져서 스크롤을 자극하는 것 방지

    // 클래스 토글 (열고 닫기)
    contactInfoWrap.classList.toggle("show");

    // 상태 변수 업데이트
    isInfoOpen = contactInfoWrap.classList.contains("show");

    console.log("현재 정보창 오픈 상태:", isInfoOpen);
  });
}

// QR코드//

const kakaoBtn = document.getElementById("kakaoBtn");
const qrModal = document.getElementById("qrModal");
const closeModal = document.getElementById("closeModal");

if (kakaoBtn && qrModal && closeModal) {
  // 1. 카톡 아이콘 클릭 시 팝업 띄우기
  kakaoBtn.addEventListener("click", (e) => {
    e.preventDefault(); // 링크 기본 이동 방지
    qrModal.classList.add("active");
  });

  // 2. X 버튼 클릭 시 팝업 닫기
  closeModal.addEventListener("click", () => {
    qrModal.classList.remove("active");
  });

  // 3. 팝업 바깥 어두운 배경(오버레이)을 클릭해도 닫히게 하는 센스 기능
  qrModal.addEventListener("click", (e) => {
    if (e.target === qrModal) {
      qrModal.classList.remove("active");
    }
  });
}
