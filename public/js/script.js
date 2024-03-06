const btn = document.querySelector("button");
const outputme = document.querySelector(".output-you");
const outputbot = document.querySelector(".output-bot");
const socket = io();

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.interimResults = false;

btn.addEventListener("click", () => {
  // Check if the bot is speaking
  if (!isBotSpeaking()) {
    recognition.start();
  }
});

recognition.onresult = function (event) {
  const last = event.results.length - 1;
  console.log(JSON.stringify(event.results))
  const text = event.results[last][0].transcript;
  console.log(text);

  outputme.textContent = text;

  socket.emit("chat message", text);
};

const botReply = (text) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.pitch = 1;
  utterance.volume = 1;
  synth.speak(utterance);

  // Start the recognition after the bot has finished speaking
  utterance.onend = () => {
    recognition.start();
  };
};

const isBotSpeaking = () => {
  const synth = window.speechSynthesis;
  return synth.speaking;
};

socket.on("bot reply", (text) => {
  outputbot.textContent = text;
  botReply(text);
});
