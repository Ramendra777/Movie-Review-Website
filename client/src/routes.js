import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Movie from './pages/Movie';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import SearchResults from './pages/SearchResults';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/movie/:id" component={Movie} />
      <Route path="/search" component={SearchResults} />
      <PrivateRoute path="/profile" component={Profile} />
      <PrivateRoute path="/admin" adminOnly component={Admin} />
    </Switch>
  );
}