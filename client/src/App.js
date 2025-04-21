// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movie from './pages/Movie';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import SearchResults from './pages/SearchResults';
import './styles/main.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/movie/:id" component={Movie} />
            <Route path="/search" component={SearchResults} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/admin" adminOnly component={Admin} />
          </Switch>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;