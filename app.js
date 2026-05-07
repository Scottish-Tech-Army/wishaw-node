var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var authRouter = require("./routes/auth");
var meRouter = require("./routes/me");
var adminRouter = require("./routes/admin");
var leaderboardsRouter = require("./routes/leaderboards");
var manageRouter = require("./routes/manage");
var badgesRouter = require("./routes/badges");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS – allow requests from the React dev server
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Hello endpoint
app.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello from Wishaw YMCA Esports API!" });
});

// Route groups
app.use("/auth", authRouter);
app.use("/me", meRouter);
app.use("/admin", adminRouter);
app.use("/leaderboards", leaderboardsRouter);
app.use("/manage", manageRouter);
app.use("/badges", badgesRouter);

// 404 handler – returns JSON
app.use((req, res, next) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Error handler – returns JSON
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;
