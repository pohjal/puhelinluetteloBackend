const { response } = require("express");
const { request } = require("express");
const express = require("express");
const app = express();
app.use(express.json());

let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2",
  },
  {
    id: "1",
    name: "lassi lataajanpoika",
    number: "1123",
  },
  {
    id: "3",
    name: "ville",
    number: "40404040",
  },
  {
    id: "4",
    name: "Kalle keksimies",
    number: "2212111¨",
  },
];

const time = () => {
  const date = new Date();
  return date;
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.delete("/api/persons/:id", (request, response) => {
  const poistettavaId = request.params.id;
  console.log(poistettavaId);
  persons = persons.filter((person) => person.id !== poistettavaId);
  console.log(persons);
  response.status(204).end();
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  console.log(person);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }

  response.send();
});

app.get("/info", (request, response) => {
  response.send(
    `<p>The Phonebook has ${persons.length} people!<p>` + `<p>${time()}`
  );
});

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const onko = (name) => {
  return persons.some(
    (person) => person.name.toLowerCase() === name.toLowerCase()
  );
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);
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

  const person = {
    name: body.name,
    number: body.number,
    id: `${Math.floor(Math.random() * 100000) + 1}`,
  };
  if (!onko(person.name)) {
    persons = persons.concat(person);
    response.json(person);
  } else {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
});