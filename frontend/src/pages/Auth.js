import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import './styles/auth.css';

class AuthPage extends Component {
  state = {
    isLogin: true
  };

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  static contextType = AuthContext;

  switchModeHandler = () => {
    this.setState((prevState) => ({ isLogin: !prevState.isLogin }));
  };

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
            query {
                login(email: "${email}", password: "${password}") {
                    userId
                    token
                    tokenExpiration
                }
            }
        `
    };
    if (!this.state.isLogin) {
      requestBody = {
        query: `
                  mutation {
                      createUser(userInput: {email: "${email}", password: "${password}"}) {
                          _id
                          email
                      }
                  }
              `
      };
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((response) => {
        const { token, userId, tokenExpiration } = response.data.login;
        if (token) this.context.login(token, userId, tokenExpiration);
      })
      .catch((error) => console.log(error));
  };

  render() {
    const { isLogin } = this.state;
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
