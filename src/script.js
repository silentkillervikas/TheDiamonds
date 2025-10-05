// ===== HERO TYPING EFFECT =====
const typingText = ["Innovative Solutions", "AI Integration", "Modern Web Design"];
let typingIndex = 0;
let charIndex = 0;
const typingElement = document.querySelector(".typing");

function typeHero() {
  if (charIndex < typingText[typingIndex].length) {
    typingElement.textContent += typingText[typingIndex][charIndex];
    charIndex++;
    setTimeout(typeHero, 100);
  } else {
    setTimeout(eraseHero, 2000);
  }
}

function eraseHero() {
  if (charIndex > 0) {
    typingElement.textContent = typingText[typingIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseHero, 50);
  } else {
    typingIndex = (typingIndex + 1) % typingText.length;
    setTimeout(typeHero, 500);
  }
}

typeHero();

// ===== PARTICLES.JS INITIALIZATION =====
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 80 },
    "color": { "value": ["#00ffff","#ff0080","#ffff00"] },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.6 },
    "size": { "value": 3 },
    "line_linked": { "enable": true, "distance": 120, "color": "#00ffff", "opacity": 0.4, "width": 1 },
    "move": { "enable": true, "speed": 2 }
  },
  "interactivity": { "events": { "onhover": { "enable": true, "mode": "repulse" } } }
});

// ===== FADE-IN ON SCROLL FOR CARDS =====
const faders = document.querySelectorAll(".card, .portfolio-item, .testimonial");
const appearOptions = { threshold: 0.1 };
const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll){
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    entry.classList.add("appear");
    appearOnScroll.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach(fader => appearOnScroll.observe(fader));

// ===== CHATBOT TOGGLE =====
const chatbotWidget = document.getElementById("chatbot-widget");
const chatContainer = document.getElementById("chat-container");
const chatbotIcon = document.getElementById("chatbot-icon");
const chatbotHeader = document.getElementById("chatbot-header");

chatbotIcon.addEventListener("click", () => {
  chatContainer.style.display = "flex";
  chatbotIcon.style.display = "none";
});

chatbotHeader.addEventListener("click", () => {
  chatContainer.style.display = "none";
  chatbotIcon.style.display = "flex";
});

// ===== CHAT ELEMENTS =====
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const voiceBtn = document.getElementById("voice-btn");

// Load chat history
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
chatHistory.forEach(msg => addMessage(msg.text, msg.sender));

function addMessage(message, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
  msgDiv.innerText = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  chatHistory.push({ text: message, sender: sender });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function addTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("typing-indicator");
  typingDiv.id = "typing-indicator";
  typingDiv.innerText = "Bot is typing";
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
  const typingDiv = document.getElementById("typing-indicator");
  if (typingDiv) typingDiv.remove();
}

// ===== AI RESPONSE (CALL BACKEND) =====
async function getBotResponse(message) {
  addTypingIndicator();
  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    removeTypingIndicator();
    const botReply = data.reply;

    // VOICE OUTPUT
    const utterance = new SpeechSynthesisUtterance(botReply);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);

    return botReply;
  } catch (err) {
    removeTypingIndicator();
    console.error("Error:", err);
    return "Sorry, something went wrong. Please try again.";
  }
}

// ===== SEND MESSAGE =====
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  addMessage(message, "user");
  userInput.value = "";
  const botReply = await getBotResponse(message);
  addMessage(botReply, "bot");
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", e => { if(e.key === "Enter") sendMessage(); });

// ===== VOICE INPUT =====
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    sendBtn.click();
  };

  recognition.onerror = function (event) { console.error("Speech recognition error:", event.error); };
  voiceBtn.addEventListener("click", () => recognition.start());
} else {
  voiceBtn.disabled = true;
  voiceBtn.title = "Voice input not supported in this browser";
}

// ===== CONTACT FORM =====
document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault();
  alert("Form submitted! (Connect to backend/email service to store messages.)");
});
