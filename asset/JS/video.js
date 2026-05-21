// 모든 영상 및 CSS 스타일 로드가 완벽히 끝난 후 실행 (여백 및 계산 버그 방지)
window.addEventListener("load", () => {
  gsap.registerPlugin(ScrollTrigger);

  const track = document.querySelector(".horizontal-track");
  const introCard = document.querySelector(".intro-card");
  const fixedText = document.querySelector(".fixed-intro-text");
  const scrollText = document.querySelector(".fixed-scroll-text");
  const spiderwebWrapper = document.querySelector(".fixed-spiderweb-wrapper");
  const spiderWrapper = document.querySelector(".fixed-spider-wrapper");

  // 첫 영상이 700px로 줄어든 후의 최종 트랙 길이를 수학적으로 정밀 계산 (여백 방지)
  const getScrollAmount = () => {
    const normalCards = track.querySelectorAll(".normal-card");
    const finalIntroWidth = 700;
    const normalCardsWidth = normalCards.length * 700;
    const totalCardsCount = normalCards.length + 1;
    const totalGaps = (totalCardsCount - 1) * 60; // 좌우 마진 30px씩 총 60px
    const paddingLeft = window.innerWidth * 0.05;

    const finalTotalWidth = finalIntroWidth + normalCardsWidth + totalGaps + paddingLeft;
    return finalTotalWidth - window.innerWidth;
  };

  // 스크롤 연동 타임라인 생성
  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".main-container",
      pin: true,
      scrub: 1.5,
      start: "top top",
      end: () => `+=${getScrollAmount() * 2.2}`,
      invalidateOnRefresh: true,
    },
  });

  // ① 스크롤 시작 단계: 상단 타이틀 등장
  scrollTl.to(fixedText, {
    autoAlpha: 1,
    duration: 1.5,
    ease: "power1.out",
  });

  // 우측 하단 스크롤 안내 문구 등장 (타이틀과 동시 실행)
  scrollTl.to(
    scrollText,
    {
      autoAlpha: 1,
      duration: 1.5,
      ease: "power1.out",
    },
    "<",
  );

  // 좌측 하단 거미줄 이미지 등장 (타이틀과 동시 실행)
  // 훨씬 진했으면 좋겠다는 요청에 따라 autoAlpha(opacity)를 1로 수정합니다.
  scrollTl.to(
    spiderwebWrapper,
    {
      autoAlpha: 1,
      duration: 1.5,
      ease: "power1.out",
    },
    "<",
  );

  scrollTl.to(
    spiderWrapper, // 위에서 선언한 변수명
    {
      autoAlpha: 1,
      duration: 1.5,
      ease: "power1.out",
    },
    "<", // 거미줄 등장할 때 동시에
  );

  // ② 이어서 첫 영상 서서히 등장
  scrollTl.to(
    introCard,
    {
      autoAlpha: 1,
      duration: 1.5,
      ease: "power1.out",
    },
    "+=0.3",
  );

  // ③ 영상이 다 나타나면 세로 높이가 600px로 확장 (거미줄과 문구는 제자리 고정)
  scrollTl.to(
    introCard,
    {
      height: "600px",
      borderRadius: "30px",
      duration: 1.5,
      ease: "power2.inOut",
    },
    "+=0.5",
  );

  // ④ 첫 영상 가로 폭이 최종 700px로 줄어듬
  scrollTl.to(introCard, {
    width: "700px",
    duration: 1.5,
    ease: "power2.inOut",
  });

  // ⑤ 가로 스크롤 작동 (정밀 연산 적용으로 여백 없이 마지막 카드가 딱 붙으며 종료)
  scrollTl.to(
    track,
    {
      x: () => -getScrollAmount(),
      ease: "none",
      duration: 5,
    },
    "-=1.2",
  );
});

// 유튜브 링크
const videoCards = document.querySelectorAll(".card");
const playerViewSection = document.getElementById("playerViewSection");
const modalIframe = document.getElementById("modalIframe");
const playerBackBtn = document.getElementById("playerBackBtn");

const playerTitle = document.getElementById("playerTitle");
const playerDesc = document.getElementById("playerDesc");
const playlistScroll = document.querySelector(".playlist-scroll");

// 1. 우측 플레이리스트 목록을 자동으로 동적 생성하는 함수
function buildPlaylist(currentId) {
  playlistScroll.innerHTML = ""; // 기존 목록 비우기

  videoCards.forEach((card, index) => {
    const vId = card.getAttribute("data-video-id");
    const title = card.getAttribute("data-title") || `PROJECT ${index + 1}`;
    const videoSrc = card.querySelector("source").getAttribute("src");

    const item = document.createElement("div");
    item.classList.add("playlist-item");
    if (vId === currentId) item.classList.add("active"); // 현재 재생 중인 영상 강조

    item.innerHTML = `
      <div class="playlist-thumb">
        <video muted playsinline loop autoplay src="${videoSrc}"></video>
      </div>
      <div class="playlist-info">
        <span class="playlist-item-title">${title}</span>
      </div>
    `;

    // 플레이리스트 내부 아이템 클릭 시 영상&내용 다이렉트 전환
    item.addEventListener("click", () => {
      loadVideo(vId, title, card.getAttribute("data-desc"));
    });

    playlistScroll.appendChild(item);
  });
}

// 2. 영상을 로드하고 플레이어 뷰에 텍스트를 매칭시키는 함수
function loadVideo(id, title, desc) {
  modalIframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&origin=${window.location.origin}`;
  playerTitle.textContent = title;
  playerDesc.textContent = desc || "프로젝트 설명이 없습니다.";
  buildPlaylist(id); // 리스트 갱신
}

// 3. 메인 가로 트랙 카드 클릭 시 -> 전체 화면 전환 처리
videoCards.forEach((card) => {
  card.addEventListener("click", () => {
    const videoId = card.getAttribute("data-video-id");
    const title = card.getAttribute("data-title");
    const desc = card.getAttribute("data-desc");

    if (videoId) {
      loadVideo(videoId, title, desc);
      // 부드럽게 화면을 플레이어 뷰로 전환 (.view-active 추가)
      playerViewSection.classList.add("view-active");
      // 화면이 전환될 때 스크롤이 움직이지 않도록 body 스크롤 임시 고정
      document.body.style.overflow = "hidden";
    }
  });
});

// 4. BACK 버튼을 눌러서 다시 원래 가로 트랙 화면으로 돌아가기
if (playerBackBtn) {
  playerBackBtn.addEventListener("click", () => {
    playerViewSection.classList.remove("view-active"); // 플레이어 뷰 숨기기
    modalIframe.src = ""; // 유튜브 비디오 중단 및 소리 끄기
    document.body.style.overflow = ""; // body 스크롤 해제
  });
}
// ---유튜브 링크
