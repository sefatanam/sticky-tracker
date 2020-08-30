const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./database/mongoose");

const app = express();
app.use(bodyParser.json());
const PORT = 3001;

//Load Model
const { List, Task } = require("./database/models");

// GET METHOD
app.get("/lists", (req, res) => {
  List.find({}).then((lists) => {
    res.send(lists);
  });
});

// POST METHOD
app.post("/lists", (req, res) => {
  let title = req.body.title;
  let newList = new List({
    title,
  });

  newList.save().then((listDoc) => {
    res.send(listDoc);
  });
});

// UPDATE or PATCH METHOD
app.patch("/lists/:id", (req, res) => {
  List.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.sendStatus(200);
  });
});

// DELETE METHOD
app.delete("/lists/:id", (req, res) => {
  List.findOneAndRemove({ _id: req.params.id }).then((removeListDoc) => {
    res.send(removeListDoc);
  });
});

// GET TASK LIST METHOD
app.get("/lists/:listId/tasks", (req, res) => {
  Task.find({ _listId: req.params.listId }).then((tasks) => {
    res.send(tasks);
  });
});

// BY ID
app.get("/lists/:listId/tasks/:tasksId", (req, res) => {
  Task.findOne({ _id: req.params.taskId, _listId: req.params.listId }).then(
    (task) => {
      res.send(task);
    }
  );
});

// POST TASK LIST BY ID METHOD
app.post("/lists/:listId/tasks", (req, res) => {
  let newTask = new Task({
    title: req.body.title,
    _listId: req.params.listId,
  });
  newTask.save().then((newTaskDoc) => {
    res.send(newTaskDoc);
  });
});

// UPDATE TASK LIST BY ID METHOD
app.patch("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findByIdAndUpdate(
    {
      _id: req.params.taskId,
      _listId: req.params.listId,
    },
    {
      $set: req.body,
    }
  ).then(() => {
    res.sendStatus(200);
  });
});

// DELETE TASK LIST BY ID METHOD
app.delete("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findByIdAndDelete({
    _id: req.params.taskId,
    _listId: req.params.listId,
  }).then((removedTaskDoc) => {
    res.send(removedTaskDoc);
  });
});

app.listen(PORT, () => {
  console.log(`Server listeing on Port ${PORT}`);
});
