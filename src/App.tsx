import { Route, Switch } from 'react-router-dom';

import HomePage from './pages/Home';

export default function App() {
  return (
    <Switch>
      <Route path="/">
        <HomePage />
      </Route>
    </Switch>
  );
}
