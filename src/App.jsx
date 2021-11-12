import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import "./css/App.css";
import User from "./pages/User";
import Home from "./pages/Home";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <Header />
      <Sidebar />

      <main>
        <Switch>
          <Route path="/user/:id">
            <User />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
