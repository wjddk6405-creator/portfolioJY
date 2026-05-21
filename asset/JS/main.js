const spiderWrap = document.querySelector(".spider-wrap");

const leftDoor = document.querySelector(".left-door");
const rightDoor = document.querySelector(".right-door");

const spider2 = document.querySelector(".spider2");

// ---------------- 스크롤 이벤트 ----------------
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const winHeight = window.innerHeight;

  // 문
  const startThreshold = winHeight * 2;

  let doorRatio = Math.min(1, scrollY / startThreshold);

  const angle = doorRatio * 110;

  leftDoor.style.transform = `rotateY(${-angle}deg)`;
  rightDoor.style.transform = `rotateY(${angle}deg)`;

  // 상단 거미
  const spiderStart = startThreshold;

  const moveRange = 1200;

  let progress = (scrollY - spiderStart) / moveRange;

  progress = Math.max(0, Math.min(progress, 1));

  const moveY = -1000 + 1500 * progress;

  spiderWrap.style.transform = `translateY(${moveY}px)`;

  spiderWrap.style.opacity = progress;

  // 하단 거미
  if (scrollY > 4000) {
    spider2.style.opacity = 1;

    let move = (scrollY - 4000) * 0.3;

    spider2.style.transform = `translate(-${move}px, -${move}px) rotate(-110deg)`;
  } else {
    spider2.style.opacity = 0;
  }
});
