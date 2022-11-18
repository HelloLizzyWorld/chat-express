/*express앱의 본체로 핵심적인 서버 역할을 담당하고 여러 미들웨어를 관리한다.
 *app.js는 node 서버의 entry point(진입점)으로 서버 시작 시 app.js에서 시작한다. */

var createError = require("http-errors");
var express = require("express"); // express 패키지를 호출
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index"); // ('./routes')과 동일
var usersRouter = require("./routes/users");

var app = express(); // app 변수 객체
app.io = require("socket.io")(); // socket
//이벤트는 emit(‘event’)으로 전달하면 on(‘event’)으로 받음

// 'connection'이벤트 소켓이 연결되면 호출, 'socket' 파라미터는 접속된 해당 소켓의 객체
// 파라미터 socket connection에 대한 정보를 가지고 있어 이를 이용해 event listener를 만듦
app.io.on("connection", (socket) => {
  console.log("socket connect!");

  socket.on("newUserConnect", (name) => {
    socket.name = name;
    var message = name + "님이 접속했습니다.";
    //'updateMessage'  이벤트 호출
    app.io.sockets.emit("updateMessage", {
      // 'app.io.sockets' 객체 : 나를 포함한 전체 소켓
      // emit 메서드를 통해 'updateMessage' 이벤트 호출
      name: "SERVER",
      message: message,
    });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnect!");
    var message = socket.name + "님이 퇴장했습니다.";
    socket.broadcast.emit("updateMessage", {
      // 'socket.broadcast' 객체 : 나를 제외한 전체 소켓
      name: "SERVER",
      message: message,
    });
  });

  socket.on("sendMessage", (data) => {
    // socket.name는 newUserConnect에서 저장함
    data.name = socket.name;
    app.io.emit("updateMessage", data);
    // 'updateMessage'의 데이터 구조에 맞게 name값 담아서 'updateMessage' 호출
  });
});

// app.set : 만들어진 app 객체에 기능을 하나씩 연결
// view engine setup
app.set("views", path.join(__dirname, "views")); // path.join => D:\workspace\chat-express\views
app.set("view engine", "jade");

// app.use : 미들웨어를 연결하는 부분
app.use(logger("dev")); // 요청과 응답에 대한 정보를 콘솔에 기록
app.use(express.json()); // req.body 객체로 만들어주는 미들웨어, 폼 데이터나 ajax요청 데이터 처리 (JSON)
app.use(express.urlencoded({ extended: false })); // (폼 전송)
app.use(cookieParser()); // 요청에 동봉된 쿠키를 해석해 req.cookies 객체로 만듦
app.use(express.static(path.join(__dirname, "public"))); // 정적인 파일들을 제공하는 라우터(접근)

app.use("/", indexRouter); // app.use(req,res,next)
app.use("/users", usersRouter); // app.use('/adc',미들웨어) : abc로 시작하는 요청에서 미들웨어 실행

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// app 객체를 모듈로 만드는 코드 이렇게 만들어진 코드가 bin/www 에서 사용된 app 모듈
module.exports = app;
