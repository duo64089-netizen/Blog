// === Gemini API integration ===
const API_KEY = "AIzaSyDkowD2cCyHNZAw6aNkVIr1C-svLuZ_HD8"; // 👈 apna Gemini API key yaha daalo
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-l:generateContent?key=" + API_KEY;

// Chat widget toggle
const chatToggle = document.createElement("button");
chatToggle.id = "chat-toggle";
chatToggle.textContent = "💬";
document.body.appendChild(chatToggle);

const chatWidget = document.createElement("div");
chatWidget.id = "chat-widget";
chatWidget.innerHTML = `
  <div id="chat-header">
    Gemini Assistant
    <span style="cursor:pointer" onclick="toggleChat()">✖</span>
  </div>
  <div id="chat-messages"></div>
  <div id="chat-input">
    <input type="text" id="user-input" placeholder="Type a message..." />
    <button onclick="sendMessage()">➤</button>
  </div>
`;
document.body.appendChild(chatWidget);

chatToggle.addEventListener("click", () => {
  chatWidget.style.display = chatWidget.style.display === "flex" ? "none" : "flex";
});

// Function to send user message
async function sendMessage() {
  const input = document.getElementById("user-input");
  const msg = input.value.trim();
  if (!msg) return;
  appendMessage("You", msg);
  input.value = "";

  appendMessage("Gemini", "Typing...");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: msg }] }]
      })
    });

    const data = await response.json();
    document.getElementById("chat-messages").lastChild.remove(); // remove "Typing..."
    const reply = data.candidates[0].content.parts[0].text;
    appendMessage("Gemini", reply);
  } catch (error) {
    document.getElementById("chat-messages").lastChild.remove();
    appendMessage("Gemini", "⚠️ Error: " + error.message);
  }
}

// Function to append messages
function appendMessage(sender, text) {
  const messages = document.getElementById("chat-messages");
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// Close chat
function toggleChat() {
  chatWidget.style.display = "none";
}
