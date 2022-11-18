document.addEventListener("DOMContentLoaded", function () {
  const socket = io(); // socket 연결
  const name = prompt("이름을 입력해주세요");

  socket.on("connect", () => {
    // 'newUserConnect' 이벤트 호출, name 전달
    socket.emit("newUserConnect", name);
  });

  // 'updateMessage' 이벤트 응답
  var messages = document.getElementById("messages");
  socket.on("updateMessage", (data) => {
    var li = document.createElement("li");
    li.innerText = data.name + "  :  " + data.message;
    messages.appendChild(li);
  });

  var msgInput = document.getElementById("msgInput");
  const form = document.querySelector("form");

  function formSubmit(event) {
    event.preventDefault(); // submit 시에 초기화되는 브라우저의 기본 동작을 막아줌
    var message = msgInput.value;
    if (!message) return false; // message가 없는경우 return false;
    socket.emit("sendMessage", { message: message }); // 'sendMessage' 이벤트 호출, message 전달
    msgInput.value = "";
  }

  form.addEventListener("submit", formSubmit);
});

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
