import { useRef, useState } from "react";
import login, { signup } from '../services/login';
import { useHistory } from "react-router";

import "./LogReg.css";
import { toast, ToastContainer } from "react-toastify";

export default function LogReg() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [loginError, setLoginError] = useState("");

  const [semail, setsEmail] = useState("");
  const [sname, setsName] = useState("");
  const [spass, setsPass] = useState("");
  const [sconfirmPass, setsConfirmPass] = useState("");

  const [signUpError, setsSignUpError] = useState("");

  const [loading, setLoading] = useState(false);

  const logins = useRef("");
  const signups = useRef("");

  const history = useHistory();

  const handleClick = () => {
    logins.current.style.transform = "translate(-280px)";
    signups.current.style.transform = "translate(-310px)";
  };

  const loginPress = async () => {
    if (!email || !pass) return setLoginError('Email & Password are Required')
    try {
      setLoading(true);
      const user = { email: email, password: pass }
      const { data } = await login(user);
      localStorage.setItem('JWT_messageME', data);
      history.push("/dashboard");
    } catch (error) {
      if (error.response) return setLoginError(error.response.data);
      toast.dark("Unable to login")
      setLoading(false);
      console.log(error)
    }
  }

  const signupPress = async () => {
    if (!semail || !sname || !spass || !sconfirmPass) return setsSignUpError('Multiple fields Left Empty');
    if (spass !== sconfirmPass) return setsSignUpError('Passwords do not match');
    try {
      setLoading(true);
      const user = { email: semail, name: sname, password: spass }
      const {data} = await signup(user);
      localStorage.setItem("JWT_messageME",data);
      history.push("/dashboard");
    } catch (error) {
      if (error.response)
        setsSignUpError(error.response.data);
        setLoading(false);
    }
  }

  return (
    <div className="main-wrapper-login">
      <ToastContainer />
      <div className="forms-wrapper">
        <div ref={logins} className="login-wrapper">
          <div className="LS-head">Login</div>
          <input
            className="signup-login-field"
            type="text"
            value={email}
            placeholder="Enter Email"
            onChange={(e) => { setEmail(e.currentTarget.value); setLoginError('') }}
          />
          <input
            className="signup-login-field"
            type="password"
            value={pass}
            placeholder="Password"
            onChange={(e) => { setPass(e.currentTarget.value); setLoginError('') }}
          />
          {loginError ? <div className="login-error">{loginError}</div> : <div className="loginError"></div>}
          <div className="btn-wrapper-login">
            <button
              onClick={() => loginPress()}
              className="LS-button">
              Login
            </button>
            <div onClick={() => handleClick()} className="to-signup">
              <span className="to-signup-tag">SignUp</span>
              <i className="fa fa-arrow-right to-ls-icon" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div ref={signups} className="signup-wrapper">
          <div className="LS-head">SignUp</div>
          <input
            className="signup-login-field"
            type="text"
            value={semail}
            placeholder="Enter Email"
            onChange={(e) => { setsEmail(e.currentTarget.value); setsSignUpError('') }}
          />
          <input
            className="signup-login-field"
            type="text"
            value={sname}
            placeholder="Name"
            onChange={(e) => { setsName(e.currentTarget.value); setsSignUpError('') }}
          />
          <input
            className="signup-login-field"
            type="password"
            value={spass}
            placeholder="Password"
            onChange={(e) => { setsPass(e.currentTarget.value); setsSignUpError('') }}
          />
          <input
            className="signup-login-field"
            type="password"
            value={sconfirmPass}
            placeholder="Confrim Password"
            onChange={(e) => { setsConfirmPass(e.currentTarget.value); setsSignUpError('') }}
          />
          {signUpError ? <div className="login-error">{signUpError}</div> : <div className="loginError"></div>}
          <div className="btn-wrapper-login">
            <div
              onClick={() => {
                logins.current.style.transform = "translate(0px)";
                signups.current.style.transform = "translate(0px)";
              }}
              className="to-signup">
              <i className="fa fa-arrow-left to-ls-icon" aria-hidden="true"></i>
              <span className="to-login-tag">Login</span>
            </div>
            <button
              onClick={() => signupPress()}
              className="LS-button">
              SignUp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


