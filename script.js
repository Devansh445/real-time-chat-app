(function () {
  const app = document.querySelector(".app");
  const socket = io("http://localhost:8000");

  let uname;

 

  
  const handleJoin = () => {
    let username = app.querySelector(".join-screen #username").value;
    if (username.length === 0) {
      return;
    }

    socket.emit("new-user", username);
    uname = username;
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  };

  app.querySelector(".join-screen #join-user").addEventListener("click", handleJoin);
  app.querySelector(".join-screen #username").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleJoin();
    }
  });

  const handleSendMessage = () => {
    let message = app.querySelector(".chat-screen #message-input").value;
    if (message.length === 0) {
      return;
    }

    renderMessage("my", {
      name: "You",
      message: message,
    });

    socket.emit("send-chat-message", message);
    app.querySelector(".chat-screen #message-input").value = "";
  };

  app.querySelector(".chat-screen #send-message").addEventListener("click", handleSendMessage);
  app.querySelector(".chat-screen #message-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  });

  app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
    socket.disconnect(); 
    window.location.reload();
  });

  const renderMessage = (type, message) => {
    let messageContainer = app.querySelector(".chat-screen .messages");

    if (type === "my") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
        <div>
          <div class="text">${message.name + ": "}${message.message}</div>

        </div>
      `;
      messageContainer.appendChild(el);
    } else if (type === "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
        <div>
          <div class="text">${message.name + ": "}${message.message}</div>
        </div>
      `;
      messageContainer.appendChild(el);
    } else if (type === "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
    }

    messageContainer.scrollTop = messageContainer.scrollHeight;
  };

  // Socket events
  socket.on("chat-message", (data) => {
    renderMessage("other", data);
  });

  socket.on("user-connected", (name) => {
    renderMessage("update", `${name} joined the chat`);
  });

  socket.on("user-disconnected", (name) => {
    renderMessage("update", `${name} left the chat`);
  });
})();
