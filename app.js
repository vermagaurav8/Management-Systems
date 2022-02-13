const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mysql = require("mysql");
// const { path } = require("express/lib/application");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static files
app.use(express.static("public"));

// Templating Engine
const handlebars = exphbs.create({ extname: ".hbs" });
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

// Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to DB
pool.getConnection((err, connection) => {
  if (err) throw err; // Not Connected
  console.log("Connected as ID" + connection.threadId);
});

// Router
// app.get("", (req, res) => {
//   res.render("home");
// });

const routes = require("./server/routes/user");
app.use("/", routes);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
