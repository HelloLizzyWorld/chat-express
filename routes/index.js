/* app.js에서 app.get같은 메서드가 라우터 부분 */

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "CHAT-EXPRESS" });
});

module.exports = router;
