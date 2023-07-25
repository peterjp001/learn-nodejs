const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const logger = require("./logger");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use(logger);

// CONFIGURATION
console.log("APPLICATIN NAME: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
console.log("Mail Server: " + config.get("mail.password"));

const appMode = app.get("env");

if (appMode === "development") {
  app.use(morgan("tiny"));
  console.log(`APP_MODE: ${appMode.toUpperCase()}`);
}

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error) res.status(400).send(result.error.details[0].message);
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);

  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
