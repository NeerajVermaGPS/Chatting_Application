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
  }
}

const setNode = () => {
    user = nodeName.value === "" ? user : nodeName.value
    profileImg = nodeImage.value === "" ? profileImg : nodeImage.value
}

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(user, profileImg, "right", msgText);
  socket.emit("user-message", {msg: msgText, id: user, image: profileImg})
  msgerInput.value = "";
});

socket.on('bot-message', (msg) => {
    appendMessage(msg.id, msg.image, "left", msg.msg);
});

function appendMessage(name, img, side, text) {
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
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
