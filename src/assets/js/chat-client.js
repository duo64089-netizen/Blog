// chat-client.js - lightweight widget that calls Netlify function
(function(){
  // create toggle button
  const btn = document.createElement("button");
  btn.id = "chat-toggle";
  btn.innerText = "💬";
  Object.assign(btn.style, {
    position: "fixed", right: "20px", bottom: "20px",
    width: "56px", height: "56px", borderRadius: "50%", border: "none",
    background: "linear-gradient(90deg,#3b82f6,#6366f1)", color: "white", fontSize: "22px", zIndex: 2000
  });
  document.body.appendChild(btn);

  // widget panel
  const panel = document.createElement("div");
  panel.id = "chat-panel";
  Object.assign(panel.style, {
    position:"fixed", right:"20px", bottom:"90px", width:"360px", maxHeight:"60vh", display:"none",
    background:"#fff", borderRadius:"12px", boxShadow:"0 10px 30px rgba(2,6,23,0.2)", zIndex:2000, overflow:"hidden", display:"flex", flexDirection:"column"
  });
  panel.innerHTML = `
    <div style="background:linear-gradient(90deg,#3b82f6,#6366f1);color:white;padding:10px;display:flex;justify-content:space-between;align-items:center">
      <div style="font-weight:600">Gemini Assistant</div>
      <div style="cursor:pointer;font-size:18px" id="chat-close">✖</div>
    </div>
    <div id="chat-messages" style="padding:10px;flex:1;overflow:auto;font-size:14px"></div>
    <div style="display:flex;border-top:1px solid #eee">
      <input id="chat-input" placeholder="Ask anything..." style="flex:1;padding:10px;border:none;outline:none" />
      <button id="chat-send" style="background:#3b82f6;color:#fff;border:none;padding:10px 12px;cursor:pointer">Send</button>
    </div>
  `;
  document.body.appendChild(panel);

  btn.addEventListener("click", ()=>{ panel.style.display = panel.style.display === "none" ? "flex" : "none"; });

  document.getElementById("chat-close").addEventListener("click", ()=>{ panel.style.display="none"; });

  async function appendMessage(who, text){
    const wrap = document.getElementById("chat-messages");
    const div = document.createElement("div");
    div.style.marginBottom = "8px";
    div.innerHTML = `<strong>${who}:</strong> <div>${text}</div>`;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
  }

  document.getElementById("chat-send").addEventListener("click", send);
  document.getElementById("chat-input").addEventListener("keypress", (e)=>{ if(e.key==='Enter') send(); });

  async function send(){
    const input = document.getElementById("chat-input");
    const text = input.value.trim(); if(!text) return;
    appendMessage("You", text); input.value = "";
    appendMessage("Gemini", "Typing...");

    try {
      const resp = await fetch("/.netlify/functions/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const j = await resp.json();
      // remove "Typing..."
      const msgs = document.getElementById("chat-messages");
      if (msgs.lastChild && msgs.lastChild.innerHTML.includes("Typing...")) msgs.lastChild.remove();
      appendMessage("Gemini", j.reply || JSON.stringify(j));
    } catch (err) {
      appendMessage("Gemini", "⚠️ Error: " + err.message);
    }
  }
})();
