import React, { Component } from "react";
import "./signIn.css";
import axios from "axios";

export default class CreateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      pass: "",
      isAuthenticated: false,
      formErrors: {
        userName: "",
        pass: "",
      },
    };
  }

  // Handle input change
  handleInputChange = (e) => {
    const { name, value } = e.target;
    let formErrors = this.state.formErrors;

    switch (name) {
      case "userName":
        formErrors.userName =
          value.length < 5 ? "Minimum characters must be 5" : "";
        break;
      case "pass":
        formErrors.pass =
          value.length < 8 || value.length > 30
            ? "Password must have between 8 and 30 characters"
            : "";
        break;
      default:
        break;
    }

    this.setState({ formErrors, [name]: value });
  };

  // Redirect user to Google OAuth
  handleGoogleSignIn = (e) => {
    e.preventDefault();
    window.location.href = "http://localhost:5000/auth/google";
  };

  // Check authentication status after component mounts
  componentDidMount() {
    axios
      .get("http://localhost:5000/auth/status", { withCredentials: true }) // Include credentials to check the session
      .then((res) => {
        this.setState({ isAuthenticated: res.data.isAuthenticated });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    const { formErrors, isAuthenticated } = this.state;

    return (
      <div className="container containerTop">
        <div className="row">
          <h1 className="top"></h1>
        </div>
        <div className="row">
          <div className="col-3"></div>
          <div className="col-6">
            <div className="shadowBoxLogin">
              <div className="row">
                <h3 className="h3">
                  {isAuthenticated ? "Welcome Back!" : "Sign In"}
                </h3>
              </div>
              <form>
                <div className="form-group textbox">
                  <label htmlFor="name" className="label">
                    User Name :{" "}
                  </label>
                  <div className="input-group position-relative">
                    <div className="input-group-addon">
                      <i className="fas fa-user icon"></i>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="userName"
                      name="userName"
                      placeholder="Shelin Kula..."
                      onChange={this.handleInputChange}
                      required
                    />
                  </div>
                  {formErrors.userName && (
                    <span className="errorMessage">{formErrors.userName}</span>
                  )}
                </div>
                <div className="form-group textbox">
                  <label htmlFor="name" className="label">
                    Password :{" "}
                  </label>
                  <div className="input-group position-relative">
                    <div className="input-group-addon">
                      <i className="fas fa-key icon"></i>
                    </div>
                    <input
                      type="password"
                      className="form-control position-relative"
                      id="pass"
                      name="pass"
                      placeholder="************"
                      onChange={this.handleInputChange}
                      required
                    />
                  </div>
                  {formErrors.pass && (
                    <span className="errorMessage">{formErrors.pass}</span>
                  )}
                </div>
                <div className="row">
                  <div className="col-3"></div>
                  <div className="form-group btndriver col-6">
                    <div
                      className="form-group signin"
                      style={{ marginTop: "15px" }}
                    >
                      <button type="submit" className="btn btn-outline-success">
                        Sign In
                      </button>
                      &nbsp;&nbsp;
                    </div>
                    {!isAuthenticated && (
                      <div
                        className="form-group signin"
                        style={{ marginTop: "15px" }}
                      >
                        <button
                          onClick={this.handleGoogleSignIn}
                          className="btn btn-outline-success"
                        >
                          Sign in with Google
                        </button>
                        &nbsp;&nbsp;
                      </div>
                    )}
                  </div>
                  <div className="col-3"></div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-3"></div>
        </div>
      </div>
    );
  }
}
