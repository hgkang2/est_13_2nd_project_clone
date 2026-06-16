const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const keywordBtns = document.querySelectorAll(".quick-btn");

async function handleSendMessage(text) {
  const messageText = text || userInput.value.trim();
  if (!messageText) return;

  if (!text) userInput.value = "";

  appendMessage(messageText, "user");

  const loadingDiv = appendMessage(
    "AI 상담원이 답변을 작성 중입니다...",
    "bot-loading",
  );

  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageText }),
    });

    const data = await response.json();
    loadingDiv.remove();

    appendMessage(data.reply, "bot");
  } catch (error) {
    loadingDiv.remove();
    appendMessage(
      "네트워크 연결에 실패했습니다. 서버가 켜져 있는지 확인해 주세요.",
      "bot",
    );
    console.error(error);
  }
}

function appendMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerHTML = text.replace(/\n/g, "<br>");
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return messageDiv;
}

sendBtn.addEventListener("click", () => handleSendMessage());
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") handleSendMessage();
});

keywordBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const query = btn.innerText
      .replace(
        /[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g,
        "",
      )
      .trim();
    handleSendMessage(query);
  });
});

document.querySelectorAll(".faq-question").forEach(question => {
  question.addEventListener("click", () => {
    const currentItem = question.parentElement;
    currentItem.classList.toggle("active");
    document.querySelectorAll(".faq-item").forEach(item => {
      if (item !== currentItem) item.classList.remove("active");
    });
  });
});

function filterFaq(category) {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  event.currentTarget.classList.add("active");

  document.querySelectorAll(".faq-item").forEach(item => {
    const match = category === "all" || item.dataset.category === category;
    item.style.display = match ? "" : "none";
    item.classList.remove("active");
  });
}
