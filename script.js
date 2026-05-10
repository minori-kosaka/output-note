const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwTsdzAkhYx96Ct40Uf3kG3AZJcuRoE89wR_fiDV-0lt9ceLvl3S00RCxKRr6Qotnfnvw/exec";

const form = document.querySelector("#feedback-form");
const statusText = document.querySelector("#form-status");
const submitButton = document.querySelector("#submit-button");
const extraPromptLabel = document.querySelector("#extra-prompt-label");
const extraPromptInput = document.querySelector("#extraPrompt");
const sourceInput = document.querySelector("#source");
const pageUrlInput = document.querySelector("#pageUrl");
const thanksModal = document.querySelector("#thanks-modal");
const modalClose = document.querySelector(".modal-close");

const extraPrompts = [
  "近況を教えてください",
  "最近の練習のことを教えてください",
  "最近気になっていることを教えてください",
  "最近の悩みを教えてください",
  "最近練習している曲を教えてください",
  "いま目標にしていることを教えてください"
];

const params = new URLSearchParams(window.location.search);
const selectedExtraPrompt = extraPrompts[Math.floor(Math.random() * extraPrompts.length)];
extraPromptLabel.textContent = selectedExtraPrompt;
extraPromptInput.value = selectedExtraPrompt;
sourceInput.value = params.get("source") || "unknown";
pageUrlInput.value = window.location.href;

function setStatus(message, type = "") {
  statusText.textContent = message;
  statusText.className = `status ${type}`.trim();
}

function openThanksModal() {
  thanksModal.hidden = false;
}

function closeThanksModal() {
  thanksModal.hidden = true;
}

modalClose.addEventListener("click", closeThanksModal);
thanksModal.addEventListener("click", (event) => {
  if (event.target === thanksModal) {
    closeThanksModal();
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (GAS_ENDPOINT.includes("ここに")) {
    setStatus("送信先URLがまだ設定されていません。", "error");
    return;
  }

  submitButton.disabled = true;
  setStatus("送信しています...");

  const payload = Object.fromEntries(new FormData(form).entries());
  payload.userAgent = navigator.userAgent;

  try {
    const response = await fetch(GAS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    form.reset();
    extraPromptInput.value = selectedExtraPrompt;
    sourceInput.value = params.get("source") || "unknown";
    pageUrlInput.value = window.location.href;
    setStatus("");
    openThanksModal();
  } catch (error) {
    setStatus("送信できませんでした。時間をおいてもう一度お試しください。", "error");
  } finally {
    submitButton.disabled = false;
  }
});
