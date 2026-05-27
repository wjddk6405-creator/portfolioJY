const PROJECTS = [
  {
    id: 1,
    title: "Mountain",
    desc: "리액트를 활용한 MOUNTAINS 사이트입니다.",
    tags: ["#반응형", "슬라이드", "자바스크립트", "리액트"],
    links: {
      web: "https://mountain-steel.vercel.app/",
      github: "https://github.com/wjddk6405-creator/mountain",
    },
    images: {
      desktop: "asset/img/mountain.png",
      tablet: "asset/img/mountainpad.png",
      mobile: "asset/img/mountainmobile.png",
    },
  },

  {
    id: 2,
    title: "NFNL",
    desc: "맛집 킬러라는 컨셉으로 제작된 가상의 맛집 커뮤니티 웹 사이트입니다.",
    tags: ["#반응형", "#자바스크립트", "#GSAP", "#팀프로젝트"],
    links: {
      web: "https://wjddk6405-creator.github.io/NFNL/",
      github: "https://github.com/wjddk6405-creator/NFNL",
    },
    images: {
      desktop: "asset/img/nfnlpc.png",
      tablet: "asset/img/nfnlpad.png",
      mobile: "asset/img/nfnlmobile.png",
    },
  },
  {
    id: 3,
    title: "MegaBox",
    desc: "MegaBox 사이트의 클론 코딩 사이트입니다.",
    tags: ["#반응형", "#자바스크립트", "#슬라이드"],
    links: {
      web: "https://wjddk6405-creator.github.io/MOVIESITE/",
      github: "https://github.com/wjddk6405-creator/MOVIESITE",
    },
    images: {
      desktop: "asset/img/megapc.png",
      tablet: "asset/img/megapad.png",
      mobile: "asset/img/megamobile.png",
    },
  },
  {
    id: 4,
    title: "Delta",
    desc: "Delta 항공 사이트의 클론 코딩 사이트입니다.",
    tags: ["#반응형", "슬라이드"],
    links: {
      web: "https://wjddk6405-creator.github.io/delta/",
      github: "https://github.com/wjddk6405-creator/delta",
    },
    images: {
      desktop: "asset/img/deltapc.png",
      tablet: "asset/img/deltapad.png",
      mobile: "asset/img/deltamobile.png",
    },
  },
  {
    id: 5,
    title: "Dessert",
    desc: "리액트를 활용한 DESSERT 사이트입니다.",
    tags: ["슬라이드", "자바스크립트", "리액트"],
    links: {
      web: "https://dessertreact-last.vercel.app/",
      github: "https://github.com/wjddk6405-creator/dessertreact-last",
    },
    images: {
      desktop: "asset/img/dessertpc.png",
    },
  },

  {
    id: 6,
    title: "SKIN Rx",
    desc: "SKIN Rx사이트의 클론 코딩 사이트입니다.",
    tags: ["#슬라이드", "#자바스크립트"],
    links: {
      web: "https://wjddk6405-creator.github.io/skinRx/",
      github: "https://github.com/wjddk6405-creator/skinRx",
    },
    images: {
      desktop: "asset/img/skinRx.png",
    },
  },
];

// DOM 요소 가져오기
const sliderContainer = document.getElementById("slider-container");
const mainTitle = document.getElementById("main-title");
const mainDesc = document.getElementById("main-desc");
const mainTags = document.getElementById("main-tags");
const imgDesktop = document.getElementById("main-img-desktop");
const imgTablet = document.getElementById("main-img-tablet");
const imgMobile = document.getElementById("main-img-mobile");
const btnWeb = document.getElementById("link-web");
const btnGithub = document.getElementById("link-github");

// 화면 정보 업데이트 함수
function updateMainDisplay(project) {
  mainTitle.textContent = project.title;
  mainDesc.textContent = project.desc;

  // 태그 초기화 및 생성
  mainTags.innerHTML = "";
  project.tags.forEach((tag) => {
    const span = document.createElement("span");
    span.textContent = tag;
    mainTags.appendChild(span);
  });

  // 💡 이미지 설정 로직 수정
  // 기존 클래스 제거 후, 이미지 개수에 따라 별도 클래스 부여 (CSS 제어용)
  const mockupGroup = document.querySelector(".mockup-group");
  mockupGroup.classList.remove("single-image", "multiple-images");

  if (project.images.tablet && project.images.mobile) {
    mockupGroup.classList.add("multiple-images");
    imgDesktop.parentElement.style.display = "block";
    imgTablet.parentElement.style.display = "block";
    imgMobile.parentElement.style.display = "block";

    imgDesktop.src = project.images.desktop;
    imgTablet.src = project.images.tablet;
    imgMobile.src = project.images.mobile;
  } else {
    // 이미지 하나만 있을 때
    mockupGroup.classList.add("single-image");
    imgDesktop.parentElement.style.display = "block";
    imgTablet.parentElement.style.display = "none"; // 나머지 숨김
    imgMobile.parentElement.style.display = "none"; // 나머지 숨김

    imgDesktop.src = project.images.desktop;
  }

  // 버튼 링크 업데이트는 동일
  btnWeb.href = project.links.web || "#";
  btnGithub.href = project.links.github || "#";
}

// 슬라이더 초기화 함수
function initSlider() {
  PROJECTS.forEach((project, index) => {
    const card = document.createElement("div");

    // 💡 [교정] 일반 카드 클래스와 함께 Swiper 전용 슬라이드 클래스도 함께 줍니다.
    card.classList.add("slide-card", "swiper-slide");

    if (project.images && project.images.desktop) {
      card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('${project.images.desktop}')`;
    }

    card.textContent = project.title;

    if (index === 0) {
      card.classList.add("active");
      updateMainDisplay(project);
    }

    card.addEventListener("click", () => {
      document.querySelector(".slide-card.active")?.classList.remove("active");
      card.classList.add("active");
      updateMainDisplay(project);
    });

    sliderContainer.appendChild(card);
  });

  // 💡 [핵심] 카드가 다 생성된 직후에 Swiper를 가동시킵니다!
  initSwiperPlugin();
}

// 💡 Swiper 가동 및 옵션 설정 (정확히 3개 보여주기 + 마우스 휠 작동)
function initSwiperPlugin() {
  new Swiper(".slider-section", {
    slidesPerView: 3, // 🔥 한 화면에 정확히 카드 3개 보여주기!
    spaceBetween: 20, // 카드 사이의 간격 (gap처럼 20px)
    mousewheel: true, // 🔥 마우스 휠을 굴리면 가로로 슬라이드 넘어가기!
    nested: true, // 상위 페이지 스크롤과 부딪히지 않도록 보호

    autoplay: {
      delay: 5000,
      disableOnInteraction: false, // 💡 사용자가 카드를 클릭하거나 마우스로 밀어도 자동 슬라이드가 멈추지 않고 계속 작동하게 합니다.
    },
  });
}
// 최초 실행
initSlider();

// 거미 이동
// 💡 브라우저 스크롤을 무시하고, 박스의 '실체 위치'를 감시하는 마법의 코드
function watchWebSection() {
  const targetBox = document.querySelector(".screen-container");
  const spider = document.querySelector(".webSpider");

  if (!targetBox || !spider) return;

  // 브라우저 화면 높이 측정
  const windowHeight = window.innerHeight;

  function updateSpider() {
    // 1. Web Archive 박스의 현재 화면 상의 위치(top)를 실시간으로 가져옵니다.
    const boxTop = targetBox.getBoundingClientRect().top;

    // 2. 박스가 화면 밑바닥에 대기 중일 때와, 화면 꼭대기까지 올라왔을 때의 구간 설정
    const startPoint = windowHeight; // 화면 맨 밑바닥에 걸쳤을 때
    const endPoint = 0; // 화면 맨 꼭대기에 붙었을 때

    // 3. 박스가 올라오는 진행도를 0에서 1 사이의 비율로 계산
    if (boxTop <= startPoint && boxTop >= endPoint) {
      const progress = (startPoint - boxTop) / (startPoint - endPoint);

      // 🏃‍♂️ 박스가 올라오는 박자에 100% 동기화하여 거미를 대각선 아래로 기어가게 만듬
      gsap.to(spider, {
        x: progress * -350,
        y: progress * 620,
        rotation: -140 + progress * 40,
        duration: 0.1,
        overwrite: "auto",
      });
    } else if (boxTop > startPoint) {
      // 박스가 아직 저 아래에서 안 올라왔을 때: 원래 자리 대기
      gsap.set(spider, { x: 0, y: 0, rotation: -140 });
    } else if (boxTop < endPoint) {
      // ✅ 박스가 화면 꼭대기를 지나쳐 올라가도 마지막 위치에 고정
      gsap.set(spider, {
        x: -350,
        y: 620,
        rotation: -100,
      });
    }

    // 🔄 가로 스크롤 플러그인이 화면을 움직일 때마다 이 함수를 무한 반복 감시 실행
    requestAnimationFrame(updateSpider);
  }

  // 감시 작동 시작!
  requestAnimationFrame(updateSpider);
}

// 페이지가 로드되면 감시자 가동
window.addEventListener("DOMContentLoaded", watchWebSection);
// 거미 이동
