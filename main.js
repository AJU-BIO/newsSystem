const chipsContainer = document.getElementById("chips-container");
const keywordsInput = document.getElementById("keywords");
let keywords = [];

function handleKeywordInput(event) {
  if (event.key === "Enter" && keywordsInput.value.trim() !== "") {
    event.preventDefault();
    const keyword = keywordsInput.value.trim();
    keywords.push(keyword);
    addChip(keyword);
    keywordsInput.value = "";
  }
}

function addChip(keyword) {
  if (keyword.length < 2) {
    OpenPopUp("키워드 오류", "2글자 이상 입력하셔야합니다.");
  }
  const chip = document.createElement("div");
  chip.className = "chip";
  chip.innerHTML = `<span>${keyword}</span><span class="close-btn" onclick="removeChip(this, '${keyword}')">&times;</span>`;
  chipsContainer.appendChild(chip);
}

function removeChip(element, keyword) {
  chipsContainer.removeChild(element.parentElement);
  keywords = keywords.filter((k) => k !== keyword);
}

function handleRegister() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const ccEmail = document.getElementById("cc-email").value;
  const subject = document.getElementById("subject").value;

  const data = {
    name: name,
    email: email,
    ccEmail: ccEmail,
    subject: subject,
    keywords: keywords,
  };

  console.log(JSON.stringify(data));
  OpenPopUp(
    "데이터전송",
    "데이터가 JSON 형식으로 전송되었습니다. (콘솔을 확인해주세요)"
  );
}

// 팝업 열기 함수
function OpenPopUp(title, content) {
  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-content").innerText = content;
  document.getElementById("popup").style.display = "flex";
}

// 팝업 닫기 함수
function closePopUp() {
  document.getElementById("popup").style.display = "none";
}
