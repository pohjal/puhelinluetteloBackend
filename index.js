require("dotenv").config();
const { response } = require("express");
const { request } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use(express.static("dist"));
const Person = require("./models/person");

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});
app.use(morgan("tiny"));
app.use(morgan(":method :url :body"));
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const time = () => {
  const date = new Date();
  return date;
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id).then((result) => {
    response.status(204).end();
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  response.send(
    `<p>The Phonebook has ${persons.length} people!<p>` + `<p>${time()}`
  );
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

const onko = (name) => {
  return persons.some(
    (person) => person.name.toLowerCase() === name.toLowerCase()
  );
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  // if (!onko(person.name)) {
  //   persons = persons.concat(person);
  //   response.json(person);
  // } else {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
