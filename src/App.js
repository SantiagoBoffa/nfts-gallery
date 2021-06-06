import React from "react";
import { Switch, Route } from "react-router-dom";
import { routes } from "./routes";

const App = () => {
  return (
      <Switch>
        {routes.map(({ exact, path, component: Comp }) => (
          <Route path={path} exact={exact} key={path} component={Comp} />
        ))}
      </Switch>
  );
};

export default App;
