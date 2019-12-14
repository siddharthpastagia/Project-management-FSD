import React from "react";
import "./App.css";
import AppNav from "./components/AppNav/AppNav";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { AddProject } from "./components/AddProject/AddProject";
import { AddTask } from "./components/AddTask/AddTask";
import { AddUser } from "./components/AddUser/AddUser";
import ViewTask from "./components/ViewTask/ViewTask";
function App() {
  return (
    <>
      <Router>
        <AppNav />
        <div className="main-container">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/add-project" component={AddProject} />
            <Route exact path="/add-task" component={AddTask} />
            <Route exact path="/add-user" component={AddUser} />
            <Route exact path="/view-task" component={ViewTask} />
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
