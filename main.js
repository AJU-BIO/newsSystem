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

  if (name == "") {
    OpenPopUp("경고", "이름은 필수입력입니다.");
    return false;
  }
  if (email == "") {
    OpenPopUp("경고", "이메일주소는 필수입력입니다.");
    return false;
  }
  if (subject == "") {
    OpenPopUp("경고", "제목은 필수입력입니다.");
    return false;
  }

  const data = {
    name: name,
    email: email,
    ccEmail: ccEmail,
    subject: subject,
    keywords: keywords,
  };

  const res = fetchData(data);
  console.log(res);
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

function fetchData(data) {
  const url =
    "https://script.google.com/macros/s/AKfycbxU1Ey7pvBThDREliKYqRdUp7Aeb9FQJsNMDmFzlh12WhmZUnEvHCgt0dFs-nilpfvY/exec";

  // Fetch API를 사용하여 POST 요청 보내기
  fetch(url, {
    method: "POST", // HTTP 메서드 설정
    headers: {
      "Content-Type": "application/json", // 요청 본문의 형식 지정
    },
    body: JSON.stringify(data), // 데이터를 JSON 문자열로 변환하여 요청 본문에 추가
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return "TEST 성공"; // 응답을 JSON으로 변환
      // return response.json(); // 응답을 JSON으로 변환
    })
    .then((result) => {
      console.log("Success:", result); // 요청 성공 시 결과 출력
    })
    .catch((error) => {
      console.error("Error:", error); // 요청 실패 시 에러 출력
    });
}
