// implement your API here
const express = require("express");

const db = require("./data/db");

const port = 8000;

const app = express();

app.use(express.json());

app.post("/api/users", (req, res) => {
  console.log(req.body);
  if (req.body && req.body.bio && req.body.name) {
    db.insert(req.body).then(id => {
      res.status(201).json(id);
    });
  } else {
    res
      .status(400)
      .json({ error: "Please provide a name and a bio for the user" });
  }
});

app.get("/api/users", (req, response) => {
  db.find()
    .then(res => {
      response.status(200).json(res);
    })
    .catch(err => {
      response
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(result => {
      if (result) res.status(200).json(result);
      else
        res
          .status(404)
          .json({ error: "The user with the specified ID does not exist." });
    })
    .catch(error => {
      console.log(error);
      res
        .status(400)
        .json({ error: "The user information could not be retrieved" });
    });
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(result => {
      if (result)
        res
          .status(200)
          .json({ message: `Successfully deleted ${result} entries.` });
      else
        res
          .status(404)
          .json({ error: "The user with the specified ID does not exist." });
    })
    .catch(error => {
      res.status(500).json({ error: "The user could not be removed." });
    });
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  if (req.body && req.body.name && req.body.bio) {
    db.update(id, req.body)
      .then(result => {
        if(result) res.status(200).json(req.body);
        else res.status(404).json({error: "The user with the specified ID does not exist."});
      })
      .catch(error => {
        res.status(500).json({error: "The user information could not be modified"});
      });
  } else
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
