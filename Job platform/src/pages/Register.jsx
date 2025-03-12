import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUsernameError, setEmailError, setPasswordError, clearErrors } from '../store'; // Импортируем действия
import "../styles/LogReg.css";

export default function Register(props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Используем Redux для ошибок
  const usernameError = useSelector((state) => state.auth.usernameError);
  const emailError = useSelector((state) => state.auth.emailError);
  const passwordError = useSelector((state) => state.auth.passwordError);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onButtonClick = () => {
    // Сбрасываем ошибки
    dispatch(clearErrors());

    // Проверяем введенные данные
    if ("" === username) {
      dispatch(setUsernameError("Please enter your username"));
      return;
    }

    if ("" === email) {
      dispatch(setEmailError("Please enter your email"));
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      dispatch(setEmailError("Please enter a valid email"));
      return;
    }

    if ("" === password) {
      dispatch(setPasswordError("Please enter a password"));
      return;
    }

    if (password.length < 7) {
      dispatch(setPasswordError("The password must be 8 characters or longer"));
      return;
    }

    signUp();
  };

  const onPClick = () => {
    navigate("/login");
  };

  const signUp = () => {
    const bio = '';
    const role = 'USER';
    fetch("http://localhost:8081/user", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password, bio, role })
    })
      .then(r => {
        if (r.status === 201) {
          console.log('user created.');
          navigate("/login");
        }
        else {
          console.log('failed to create user');
        }
      })
  };

  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <div>Register</div>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={username}
          placeholder="Enter your username here"
          onChange={ev => setUsername(ev.target.value)}
          className={"inputBox"} />
        <label className="errorLabel">{usernameError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={ev => setEmail(ev.target.value)}
          className={"inputBox"} />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={ev => setPassword(ev.target.value)}
          className={"inputBox"} />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          className={"inputButton"}
          type="button"
          onClick={onButtonClick}
          value={"Sign up"} />
      </div>
      <br />
      <div className={"pContainer"}>
        <p
          className={"navigateLogin"}
          onClick={onPClick}>
          Log in!
        </p>
      </div>
    </div>
  );
}
