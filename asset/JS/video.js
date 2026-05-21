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
