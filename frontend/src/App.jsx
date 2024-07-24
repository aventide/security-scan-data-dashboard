import { Route, Switch } from "wouter";

import Devices from "./views/Devices";
import Events from "./views/Events";
import Metrics from "./views/Metrics";
import Header from "./views/Header";

function App() {
  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <Switch>
        <Route path="/" component={Devices} />
        <Route path="/devices" component={Devices} />
        <Route path="/events" component={Events} />
        <Route path="/metrics" component={Metrics} />
      </Switch>
    </div>
  );
}

export default App;
