function createHeadlineCards(headlines) {
  const cardsContainer = document.querySelector(".headline-cards");
  cardsContainer.innerHTML = "";

  // 순환을 위해 처음 카드들을 끝에 한번 더 추가
  const extendedHeadlines = [...headlines, ...headlines];

  extendedHeadlines.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "headline-card";

    card.innerHTML = `
      <a href="${item.url}" target="_blank">
      <img src="${item.imgURL}" alt="${item.headline}">
      <div class="headline-card-content">
        <div class="press">${item.press}</div>
        <h3 class="headline">${item.headline}</h3>
        <div class="time">${item.yymmdd} ${item.hhmm}</div>
      </div>
      </a>
    `;

    cardsContainer.appendChild(card);
  });

  initializeSlider();
}

function updateActiveCards() {
  const cards = document.querySelectorAll(".headline-card");
  const centerIndex = Math.floor(cards.length / 2);

  cards.forEach((card, index) => {
    card.classList.remove("active");
    if (index === centerIndex) {
      card.classList.add("active");
    }
  });
}

function slideCards(direction) {
  if (isAnimating) return;
  isAnimating = true;

  const moveAmount = direction === "prev" ? totalWidth : -totalWidth;
  currentPosition += moveAmount;

  // 무한 슬라이드를 위한 위치 조정
  if (currentPosition < -(totalWidth * 4)) {
    // 마지막 카드에서 첫 번째 카드로
    container.style.transition = "transform 0.5s ease";
    container.style.transform = `translateX(${currentPosition}px)`;

    setTimeout(() => {
      container.style.transition = "none";
      currentPosition = 0;
      container.style.transform = `translateX(${currentPosition}px)`;
      setTimeout(() => {
        container.style.transition = "transform 0.5s ease";
      }, 50);
    }, 500);
  } else if (currentPosition > 0) {
    // 첫 번째 카드에서 마지막 카드로
    container.style.transition = "transform 0.5s ease";
    container.style.transform = `translateX(${currentPosition}px)`;

    setTimeout(() => {
      container.style.transition = "none";
      currentPosition = -(totalWidth * 4);
      container.style.transform = `translateX(${currentPosition}px)`;
      setTimeout(() => {
        container.style.transition = "transform 0.5s ease";
      }, 50);
    }, 500);
  } else {
    // 일반적인 슬라이드
    container.style.transform = `translateX(${currentPosition}px)`;
  }

  // 슬라이드 후 active 상태 업데이트
  setTimeout(() => {
    updateActiveCards();
    isAnimating = false;
  }, 500);
}

function initializeSlider() {
  const container = document.querySelector(".headline-cards");
  const prevButton = document.querySelector(".slide-button.prev");
  const nextButton = document.querySelector(".slide-button.next");
  const cardWidth = 280;
  const cardMargin = 20;
  const totalWidth = cardWidth + cardMargin;
  let currentPosition = 0;
  let isAnimating = false;

  // 초기 active 상태 설정
  updateActiveCards();

  function slideCards(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const moveAmount = direction === "prev" ? totalWidth : -totalWidth;
    currentPosition += moveAmount;

    // 무한 슬라이드를 위한 위치 조정
    if (currentPosition < -(totalWidth * 4)) {
      // 마지막 카드에서 첫 번째 카드로
      container.style.transition = "transform 0.5s ease";
      container.style.transform = `translateX(${currentPosition}px)`;

      setTimeout(() => {
        container.style.transition = "none";
        currentPosition = 0;
        container.style.transform = `translateX(${currentPosition}px)`;
        setTimeout(() => {
          container.style.transition = "transform 0.5s ease";
        }, 50);
      }, 500);
    } else if (currentPosition > 0) {
      // 첫 번째 카드에서 마지막 카드로
      container.style.transition = "transform 0.5s ease";
      container.style.transform = `translateX(${currentPosition}px)`;

      setTimeout(() => {
        container.style.transition = "none";
        currentPosition = -(totalWidth * 4);
        container.style.transform = `translateX(${currentPosition}px)`;
        setTimeout(() => {
          container.style.transition = "transform 0.5s ease";
        }, 50);
      }, 500);
    } else {
      // 일반적인 슬라이드
      container.style.transform = `translateX(${currentPosition}px)`;
    }

    // 슬라이드 후 active 상태 업데이트
    setTimeout(() => {
      updateActiveCards();
      isAnimating = false;
    }, 500);
  }

  // 자동 슬라이드
  let autoSlideInterval = setInterval(() => {
    slideCards("next");
  }, 2000);

  // 버튼 이벤트 리스너
  prevButton.addEventListener("click", () => {
    clearInterval(autoSlideInterval);
    slideCards("prev");
    // 클릭 후 자동 슬라이드 재시작
    autoSlideInterval = setInterval(() => {
      slideCards("next");
    }, 2000);
  });

  nextButton.addEventListener("click", () => {
    clearInterval(autoSlideInterval);
    slideCards("next");
    // 클릭 후 자동 슬라이드 재시작
    autoSlideInterval = setInterval(() => {
      slideCards("next");
    }, 2000);
  });

  // 슬라이더에 마우스 올렸을 때
  container.addEventListener("mouseenter", () => {
    clearInterval(autoSlideInterval);
  });

  // 슬라이더에서 마우스가 벗어났을 때 자동 슬라이드 재시작
  container.addEventListener("mouseleave", () => {
    autoSlideInterval = setInterval(() => {
      slideCards("next");
    }, 2000);
  });
}

const googleUrl = document
  .querySelector('meta[name="google-url"]')
  .getAttribute("content");
console.log("Google URL:", googleUrl);

const jsURL = import.meta.env.VITE_GOOGLEURL;
console.log(jsURL);
if (!jsURL) {
  console.error("GOOGLEURL 환경변수가 설정되지 않았습니다.");
}

let headlineNews = []; // 현재 헤드라인 뉴스 저장
let totalNews = []; // 전체 뉴스 데이터 저장

async function fetchNewsData() {
  const loadingElement = document.getElementById("loading");
  const mainElement = document.querySelector("main");
  const searchSection = document.querySelector(".search-section");

  try {
    // 초기 로딩 표시
    loadingElement.style.display = "flex";
    mainElement.style.display = "none";
    searchSection.style.display = "none";

    // 1단계: 헤드라인 데이터 로딩
    console.log("헤드라인 데이터 요청 시작");
    const response = await fetch(jsURL + "?id=newsMainPage");
    const data = await response.json();

    if (!data.nowHeadline) {
      console.error("데이터 구조가 올바르지 않습니다:", data);
      return;
    }

    headlineNews = data.nowHeadline;
    console.log("헤드라인 뉴스 개수:", headlineNews.length);

    // 헤드라인 섹션 초기화 및 표시
    await createHeadlineCards(headlineNews);
    initializeSubscribeForm();

    // 헤드라인 섹션 표시
    loadingElement.style.display = "none";
    mainElement.style.display = "flex";
    setTimeout(() => {
      mainElement.classList.add("loaded");
    }, 50);

    // 2단계: 전체 뉴스 데이터 로딩
    console.log("전체 뉴스 데이터 요청 시작");
    const responseTotal = await fetch(jsURL + "?id=totalPage");
    const dataTotal = await responseTotal.json();

    if (!dataTotal.total) {
      console.error("데이터 구조가 올바르지 않습니다:", dataTotal);
      return;
    }

    totalNews = dataTotal.total;

    // 검색 섹션 초기화 및 표시
    initializeSearch();
    searchSection.style.display = "block";
  } catch (error) {
    console.error("뉴스 데이터를 가져오는데 실패했습니다:", error);
    loadingElement.innerHTML = `
      <div style="text-align: center; color: #ff0000;">
        <p>데이터를 불러오는데 실패했습니다.</p>
        <p>잠시 후 다시 시도해주세요.</p>
      </div>
    `;
  }
}

function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const resultsTable = document.getElementById("resultsTable");

  // 구독 관련 요소들 추가
  const subscribeBtn = document.getElementById("subscribeBtn");
  const subscribeSection = document.querySelector(".subscribe-section");
  const closeButton = document.querySelector(".close-button");
  const contentWrapper = document.querySelector(".content-wrapper");

  // 구독 버튼 이벤트 리스너
  subscribeBtn.addEventListener("click", function () {
    subscribeSection.style.display = "block";
    const isWideScreen = window.innerWidth > 768;

    if (isWideScreen) {
      contentWrapper.classList.add("split-view");
    }

    subscribeSection.scrollIntoView({ behavior: "smooth" });
  });

  // 닫기 버튼 이벤트 리스너
  closeButton.addEventListener("click", function () {
    subscribeSection.style.display = "none";
    contentWrapper.classList.remove("split-view");
  });

  let debounceTimer;

  // 기존 검색 관련 코드
  searchInput.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const searchTerm = this.value.trim();
      if (searchTerm.length >= 2) {
        const results = searchNews(searchTerm);
        displayResults(results);
      } else {
        searchResults.innerHTML = "";
        resultsTable.style.display = "none";
        searchResults.appendChild(resultsTable);
      }
    }, 300);
  });

  // 화면 크기 변경 감지
  window.addEventListener("resize", function () {
    const isWideScreen = window.innerWidth > 768;
    if (subscribeSection.style.display === "block") {
      if (isWideScreen) {
        contentWrapper.classList.add("split-view");
      } else {
        contentWrapper.classList.remove("split-view");
      }
    }
  });
}

function searchNews(searchTerm) {
  return totalNews.filter((news) => {
    const searchFields = [
      news.title.toLowerCase(),
      news.keywords?.toLowerCase() || "",
    ];
    return searchFields.some((field) =>
      field.includes(searchTerm.toLowerCase())
    );
  });
}

function displayResults(results) {
  const searchResults = document.getElementById("searchResults");
  const resultsTable = document.getElementById("resultsTable");

  // 테이블 초기화
  const tbody = resultsTable.querySelector("tbody");
  tbody.innerHTML = "";

  // 검색 결과 수를 표시할 요소 추가
  const resultCount = document.createElement("tr");
  resultCount.innerHTML = `
    <td colspan="3" class="result-count">
      총 ${results.length}개의 검색결과가 있습니다.
    </td>
  `;
  tbody.appendChild(resultCount);

  // 결과 표시 로직
  results.forEach((news) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="td_press">${news.press}</td>
      <td class="td_date">${new Date(news.date)
        .toLocaleDateString()
        .replace(/20\d{2}\./, "")}</td>
      <td class="td_title"><a href="${news.link}" target="_blank">${
      news.title
    }</a></td>
    `;
    tbody.appendChild(row);
  });

  // 테이블 표시
  searchResults.innerHTML = "";
  searchResults.appendChild(resultsTable);
  resultsTable.style.display = "table";
}

function initializeSubscribeForm() {
  const chipInput = document.getElementById("chipInput");
  const chipContainer = document.getElementById("chipContainer");
  const subscribeForm = document.getElementById("subscribeForm");

  // 키워드 칩 추가 이벤트
  chipInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // 폼 제출 방지
      const keyword = this.value.trim();

      if (keyword.length >= 2) {
        addKeywordChip(keyword);
        this.value = ""; // 입력창 초기화
      } else {
        // 모달 대신 console.log로 변경
        console.log("키워드는 2글자 이상 입력해주세요.");
      }
    }
  });

  // 폼 제출 이벤트
  subscribeForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // 키워드 수집
    const keywords = Array.from(chipContainer.querySelectorAll(".chip")).map(
      (chip) => chip.textContent.replace("×", "").trim()
    );

    // 폼 데이터 수집
    const formData = {
      type: "addMail",
      name: document.getElementById("name").value,
      subject: document.getElementById("subject").value,
      mailto: document.getElementById("mailto").value,
      mailcc: document.getElementById("mailcc").value,
      keywords: keywords,
    };

    try {
      showModal("등록 중입니다...", true);

      const response = await fetch(jsURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        showModal(result.message || "구독 신청이 완료되었습니다.");
        subscribeForm.reset();
        chipContainer.innerHTML = "";
        document.querySelector(".subscribe-section").style.display = "none";
        document
          .querySelector(".content-wrapper")
          .classList.remove("split-view");
        document.querySelector(".search-section").style.display = "block";
      } else {
        showModal(result.message || "구독 신청 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      showModal("서버 통신 중 오류가 발생했습니다.");
    }
  });
}

// 키워드 칩 추가 함수
function addKeywordChip(keyword) {
  const chipContainer = document.getElementById("chipContainer");

  const chip = document.createElement("div");
  chip.className = "chip";

  const text = document.createTextNode(keyword);
  const removeButton = document.createElement("button");
  removeButton.textContent = "×";
  removeButton.onclick = function () {
    chip.remove();
  };

  chip.appendChild(text);
  chip.appendChild(removeButton);
  chipContainer.appendChild(chip);
}

// DOMContentLoaded 이벤트 리스너 수정
document.addEventListener("DOMContentLoaded", async () => {
  await fetchNewsData();
});

// 슬라이더 구현은 추후 추가 예정

// 모달 관련 함수들 추가
function showModal(message, showSpinner = false) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  const modalSpinner = document.getElementById("modal-spinner");
  const confirmBtn = document.getElementById("modal-confirm-btn");

  modalMessage.textContent = message;
  modalSpinner.style.display = showSpinner ? "block" : "none";
  confirmBtn.style.display = showSpinner ? "none" : "block";

  modal.classList.add("show");
}

function hideModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("show");
}

// 모달 초기화
document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.getElementById("modal-confirm-btn");
  confirmBtn.addEventListener("click", hideModal);
});
