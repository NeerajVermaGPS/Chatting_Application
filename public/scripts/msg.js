const msgerForm = document.querySelector(".msger-inputarea");
const msgerInput = document.querySelector(".msger-input");
const msgerChat = document.querySelector(".msger-chat");
const modalSec = document.querySelector(".modal-section");
const modalOne = document.getElementById('modal-one');
const modalOneContent = document.getElementById('content-one');
const nodeName = document.getElementById('node-name');
const nodeImage = document.getElementById('node-image');
let user = parseInt(Math.random()*100000000), profileImg = "https://www.svgrepo.com/show/529279/user-circle.svg";

const socket = io();

const toggleModalOne = () => {
  if(modalOne.classList.contains('open')) {
    modalOne.classList.remove('open')
    modalOneContent.classList.remove('open')
    setNode()
    setTimeout(()=>{
        modalSec.classList.remove("modalopen")
    }, 150)
  } else {
    modalOne.classList.add('open')
    modalOneContent.classList.add('open')
    modalSec.classList.add("modalopen")
    nodeImage.focus()
  }
}

const setNode = () => {
    nodeName.setAttribute("disabled", "true")
    user = nodeName.value === "" ? user : nodeName.value
    profileImg = nodeImage.value === "" ? profileImg : nodeImage.value
}

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage("You", profileImg, "right", msgText);
  const pending = document.querySelector(".pending")
  console.log(pending)
  socket.timeout(3000).emit("user-message", {msg: msgText, id: user, image: profileImg, time: formatDate(new Date())}, (err, res) => {
    const msgBubble = pending.querySelector(".msg-bubble");
    const statusMsg = pending.querySelector("#status-text");
    const statusImg = pending.querySelector("#status-img");
    if(err) {
        msgBubble.classList.add("error-msg")
        statusMsg.textContent = "Not sent"
        statusMsg.style.color = "#dc143c"
        statusImg.innerHTML = "<img src='/assets/err.svg' alt='error'>"
    } else {
        statusMsg.textContent = "Sent"
        statusMsg.style.color = "#84d36b"
        statusImg.innerHTML = "<img src='/assets/sent.svg' alt='sent'>"
    }
  })
  pending.classList.remove("pending")
  msgerInput.value = "";
});

socket.on('bot-message', (msg) => {
    appendMessage(msg.id, msg.image, "left", msg.msg, true);
});

console.log(socket.connected)

function appendMessage(name, img, side, text, bot, time = formatDate(new Date())) {
  const status = bot ? "" : `<div class='msg-status full-w center'><div class='center' id='status-text' style="color: #6495ed">Sending...</div><div class='center' id='status-img'></div></div>`
  const statusClass = bot ? "" : " pending"
  const msgHTML = `
    <div class="msg ${side}-msg${statusClass}">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${time}</div>
        </div>

        <div class="msg-text">${text}</div>

        ${status}
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const toggleConnection = document.querySelector(".conn-button")
toggleConnection.addEventListener('click', (e) => {
  e.preventDefault();
  if (socket.connected) {
    toggleConnection.innerText = 'Connect';
    socket.disconnect();
    toggleModalOne()
  } else {
    toggleConnection.innerText = 'Disconnect';
    socket.connect();
    toggleModalOne();
    appendMissedMessages()
  }
});

const appendMissedMessages = () => {
    socket.on("missed-messages", (messages) => {
        msgerChat.innerHTML = ""
        messages.forEach((msg) => {
            if(msg.id === user) {
                appendMessage("You", msg.image, "right", msg.msg, false, msg.time);
                const messageClass = document.querySelectorAll(".msg-status")
                const lastMessage = messageClass[messageClass.length - 1]
                lastMessage.querySelector("#status-text").textContent = "Sent"
                lastMessage.querySelector("#status-text").style.color = "#84d36b"
                lastMessage.querySelector("#status-img").innerHTML = "<img src='/assets/sent.svg' alt='sent'>"
            } else {
                appendMessage(msg.id, msg.image, "left", msg.msg, true, msg.time);
            }
        });
    });
}