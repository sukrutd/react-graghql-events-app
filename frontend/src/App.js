import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import AuthContext from './context/auth-context';
import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token, userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    const { token, userId } = this.state;
    return (
      <div className="App">
        <Router>
          <AuthContext.Provider value={{ token, userId, login: this.login, logout: this.logout }}>
            <MainNavigation />
            <main className="main-container">
              <Switch>
                {token && <Redirect from="/" to="/events" exact />}
                {token && <Redirect from="/auth" to="/events" exact />}
                {!token && <Route path="/auth" component={AuthPage} />}
                <Route path="/events" component={EventsPage} />
                {token && <Route path="/bookings" component={BookingsPage} />}
                {!token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </Router>
      </div>
    );
  }
}

export default App;
