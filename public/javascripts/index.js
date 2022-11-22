document.addEventListener("DOMContentLoaded", function () {
  const socket = io(); // socket 연결
  let name = prompt("이름을 입력해주세요");
  if (!name) {
    // 이름 입력을 하지 않은 경우 랜덤으로 참여
    let randomStr = Math.random().toString(36).substring(2, 8);
    name = randomStr;
  }

  socket.on("connect", () => {
    // 'newUserConnect' 이벤트 호출, name 전달
    socket.emit("newUserConnect", name);
  });

  // 'updateMessage' 이벤트 응답
  let messages = document.getElementById("messages");
  socket.on("updateMessage", (data) => {
    // 접속 혹은 접속이 끊겼을 때 select box 다시 생성
    if (data.type == "connect" || data.type == "disconnect")
      add_select_option(data);

    let li = document.createElement("li");
    li.innerText = data.name + "  :  " + data.message;
    messages.appendChild(li);
  });

  function add_select_option(data) {
    let select = document.getElementById("login_names");
    var option = document.createElement("option");
    select.options.length = 0; // select box 초기화
    option.value = "ALL";
    option.text = "모두";
    select.options.add(option);

    for (let idx in data.login) {
      var option = document.createElement("option");
      var login_name = data.login[idx].name;
      var login_id = data.login[idx].id;

      option.value = login_id;
      option.text = login_name;
      select.options.add(option);
    }
  }

  var msgInput = document.getElementById("msgInput");
  var sender = document.getElementById("login_names");
  const form = document.querySelector("form");

  function formSubmit(event) {
    event.preventDefault(); // submit 시에 초기화되는 브라우저의 기본 동작을 막아줌
    var sender_id = sender.value; // 발송 대상 socket id
    var message = msgInput.value; // 발송 메시지
    if (!message) return false; // message가 없는경우 return false;
    socket.emit("sendMessage", {
      type: "message",
      message: message,
      id: sender_id,
    }); // 'sendMessage' 이벤트 호출
    msgInput.value = "";
  }

  form.addEventListener("submit", formSubmit);
});

// jQuery 방식
// $(() => {
//   const socket = io(); // socket 연결
//   const name = prompt("이름을 입력해주세요");

//   socket.on("connect", () => {
//     // 'newUserConnect' 이벤트 호출, name 전달
//     socket.emit("newUserConnect", name);
//   });

//   // 'updateMessage' 이벤트 응답
//   socket.on("updateMessage", (data) => {
//     $("#messages").append($("<li>").text(data.name + "  :  " + data.message));
//   });

//   // 'send' 클릭
//   $("form").submit(() => {
//     var message = $("#msgInput").val();
//     if (!message) return false; // message가 없는경우 return false;

//     socket.emit("sendMessage", { message: message }); // 'sendMessage' 이벤트 호출, message 전달

//     $("#msgInput").val("");
//     return false;
//   });
// });
