window.addEventListener("load", () => {
  gsap.registerPlugin(ScrollTrigger);

  const track = document.querySelector(".horizontal-track");
  const introCard = document.querySelector(".intro-card");
  const fixedText = document.querySelector(".fixed-intro-text");
  const scrollText = document.querySelector(".fixed-scroll-text");
  const spiderwebWrapper = document.querySelector(".fixed-spiderweb-wrapper");
  const spiderWrapper = document.querySelector(".fixed-spider-wrapper");

  // [수정] 1. 초기 상태 설정: 첫 카드를 화면 중앙에 배치
  const centerCard = () => {
    const offset = (window.innerWidth - 1766) / 2; // 초기 너비 1766 기준
    gsap.set(track, { x: offset });
  };
  centerCard();

  const getScrollAmount = () => {
    const normalCards = track.querySelectorAll(".normal-card");
    const finalIntroWidth = 700;
    const normalCardsWidth = normalCards.length * 700;
    const totalCardsCount = normalCards.length + 1;
    const totalGaps = (totalCardsCount - 1) * 60;
    const paddingLeft = window.innerWidth * 0.05;

    const finalTotalWidth = finalIntroWidth + normalCardsWidth + totalGaps + paddingLeft;
    return finalTotalWidth - window.innerWidth;
  };

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".main-container",
      pin: true,
      scrub: 1.5,
      start: "top top",
      end: () => `+=${getScrollAmount() * 2.2}`,
      invalidateOnRefresh: true,
      onRefresh: centerCard,
    },
  });

  // ① 등장 애니메이션 (타이틀 및 거미)
  scrollTl.to([fixedText, scrollText, spiderwebWrapper, spiderWrapper], {
    autoAlpha: 1,
    duration: 1.5,
    ease: "power1.out",
  });

  // ② 첫 영상 서서히 등장
  scrollTl.to(
    introCard,
    {
      autoAlpha: 1,
      duration: 1.5,
      ease: "power1.out",
    },
    "+=0.3",
  );

  // ③ 영상 확장 및 중앙 -> 왼쪽 정렬 이동
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

  // ④ 첫 영상 가로 폭 축소 + 왼쪽 패딩 위치(5vw)로 트랙 이동
  scrollTl.to(
    introCard,
    {
      width: "700px",
      duration: 1.5,
      ease: "power2.inOut",
    },
    "<",
  );

  // 트랙을 왼쪽 정렬 위치로 이동 (5vw = window.innerWidth * 0.05)
  scrollTl.to(
    track,
    {
      x: () => -((window.innerWidth - 700) / 2 - window.innerWidth * 0.05),
      duration: 1.5,
      ease: "power2.inOut",
    },
    "<",
  );

  // ⑤ 가로 스크롤 작동
  scrollTl.to(
    track,
    {
      x: () => -getScrollAmount(),
      ease: "none",
      duration: 5,
    },
    "+=0.2",
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
