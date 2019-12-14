const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = express.Router();
const PORT = 4000;

let User = require("./user.model");
const projectRoutes = express.Router();
let Project = require("./project.model");
const taskRoutes = express.Router();
let Task = require("./task.model");
const parentTaskRoutes = express.Router();
let ParentTask = require("./parent.model");
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/project-management-DB", {
  useNewUrlParser: true
});
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

// todoRoutes.route('/:id').get(function(req, res) {
//   let id = req.params.id;
//   Todo.findById(id, function(err, todo) {
//     res.json(todo);
//   });
// });

//-----------------------------------------------------------------------------
// User routes
//1 . Fetch All users
userRoutes.route("/").get(function(req, res) {
  User.find(function(err, resp) {
    if (err) {
      console.log(err);
    } else {
      res.json(resp);
    }
  });
});

//2. Add new user
userRoutes.route("/add").post(function(req, res) {
  let user = new User(req.body);
  user
    .save()
    .then(user => {
      res.status(200).json({ message: "User added successfully" });
    })
    .catch(err => {
      res.status(400).send("Adding new user failed");
    });
});

//3. Update user by Id
userRoutes.route("/update/:id").put(function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (!user) res.status(404).send("User data is not found");
    else user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.empId = req.body.empId;

    user
      .save()
      .then(user => {
        res.json({ message: "User updated successfully" });
      })
      .catch(err => {
        res.status(400).send("User Update not possible");
      });
  });
});

//4. Delete user by Id
userRoutes.route("/delete/:id").get(function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (!user) res.status(404).send("User data is not found");
    else
      user
        .remove({ _id: req.params.id })
        .then(user => {
          res.json({ message: "User deleted successfully" });
        })
        .catch(err => {
          res.status(400).send("User deletion not possible");
        });
  });
});

app.use("/user", userRoutes);

//--------------------------------------------------------------
// Project routes
//1 . Fetch All project
// projectRoutes.route("/").get(function(req, res) {
//   Project.find(function(err, resp) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json(resp);
//     }
//   });
// });

//1 . Fetch All project
projectRoutes.route("/").get(function(req, res) {
  Project.find({})
    .populate("numOfTask")
    .exec(function(err, resp) {
      if (err) {
        console.log(err);
      } else {
        res.json(resp);
      }
    });
});

//2. Add new project
projectRoutes.route("/add").post(function(req, res) {
  let project = new Project(req.body);
  project
    .save()
    .then(project => {
      res.status(200).json({ message: "Project added successfully" });
    })
    .catch(err => {
      res.status(400).send("Adding new project failed");
    });
});

//3. Update project by Id
projectRoutes.route("/update/:id").put(function(req, res) {
  Project.findById(req.params.id, function(err, project) {
    if (!project) res.status(404).send("Project data is not found");
    else project.projectName = req.body.projectName;
    project.dateRequired = req.body.dateRequired;
    project.startDate = req.body.startDate;
    project.endDate = req.body.endDate;
    project.priority = req.body.priority;
    project.manager = req.body.manager;

    project
      .save()
      .then(project => {
        res.json({ message: "Project updated successfully" });
      })
      .catch(err => {
        res.status(400).send("Project Update not possible");
      });
  });
});

//4. Delete project by Id
projectRoutes.route("/delete/:id").get(function(req, res) {
  Project.findById(req.params.id, function(err, project) {
    if (!project) res.status(404).send("Project data is not found");
    else
      project
        .remove({ _id: req.params.id })
        .then(project => {
          res.json({ message: "Project deleted successfully" });
        })
        .catch(err => {
          res.status(400).send("Project deletion not possible");
        });
  });
});
app.use("/project", projectRoutes);
//--------------------------------------------------------------------------
// ADD TASK ROUTES
// ADD TASK ROUTES
taskRoutes.route("/add").post(function(req, res) {
  let task = new Task(req.body);
  task
    .save()
    .then(task => {
      res.status(200).json({ message: "Task added successfully" });
    })
    .catch(err => {
      res.status(400).send("Adding new task failed");
    });
});

// fetch all tasks

taskRoutes.route("/").get(function(req, res) {
  Task.find(function(err, resp) {
    if (err) {
      console.log(err);
    } else {
      res.json(resp);
    }
  });
});

//fetch task by project Id
taskRoutes.route("/project/:id").get(function(req, res) {
  Task.find({ project: req.params.id })
    .populate("parentTask")
    .exec(function(err, resp) {
      if (err) {
        console.log(err);
      } else {
        res.json(resp);
      }
    });
});

// fetch task by task id

taskRoutes.route("/:id").get(function(req, res) {
  Task.findById(req.params.id)
    .populate("project")
    .populate("user")
    .populate("parentTask")
    .populate("parentTaskObj")
    .exec(function(err, resp) {
      if (err) {
        console.log(err);
      } else {
        res.json(resp);
      }
    });
});

taskRoutes.route("/complete/:id").put(function(req, res) {
  Task.findById(req.params.id, function(err, task) {
    if (!task) res.status(404).send("Project data is not found");
    else task.status = "Completed";

    task
      .save()
      .then(task => {
        res.json({ message: "Task Completed successfully" });
      })
      .catch(err => {
        res.status(400).send("Task completion is not possible");
      });
  });
});

// update task by id

taskRoutes.route("/update/:id").put(function(req, res) {
  Task.findById(req.params.id, function(err, task) {
    if (!task) res.status(404).send("Task data is not found");
    else {
      task.isParentTask = req.body.isParentTask;
      task.project = req.body.project;
      task.parentTask = req.body.parentTask;
      task.taskName = req.body.taskName;
      task.endDate = req.body.endDate;
      task.startDate = req.body.startDate;
      task.priority = req.body.priority;
      task.user = req.body.user;

      task
        .save()
        .then(task => {
          res.json({ message: "Task updated successfully" });
        })
        .catch(err => {
          res.status(400).send("Task Update not possible");
        });
    }
  });
});

app.use("/task", taskRoutes);

//--------------- Parent task routes ---------------------

// fetch all parent tasks

parentTaskRoutes.route("/").get(function(req, res) {
  ParentTask.find(function(err, resp) {
    if (err) {
      console.log(err);
    } else {
      res.json(resp);
    }
  });
});

// add parent task

parentTaskRoutes.route("/add").post(function(req, res) {
  let parentTask = new ParentTask(req.body);
  parentTask
    .save()
    .then(parentTask => {
      res.status(200).json({ message: "Parent Task added successfully" });
    })
    .catch(err => {
      res.status(400).send("Adding new Parent task failed");
    });
});

// update parent task by id

parentTaskRoutes.route("/update/:id").put(function(req, res) {
  ParentTask.findById(req.params.id, function(err, parentTask) {
    if (!parentTask) res.status(404).send("Parent Task data is not found");
    else parentTask.isParentTask = req.body.isParentTask;
    parentTask.taskName = req.body.taskName;
    parentTask
      .save()
      .then(parentTask => {
        res.json({ message: "Parent Task updated successfully" });
      })
      .catch(err => {
        res.status(400).send("Parent Task Update not possible");
      });
  });
});

app.use("/parentTask", parentTaskRoutes);

//--------------------------------------------------------------
app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
