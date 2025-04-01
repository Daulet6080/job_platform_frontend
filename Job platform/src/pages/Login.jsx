import React, {useCallback, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/LogReg.css";
import logo from '../assets/logo.png';

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();

    const logIn = useCallback(() => {
        fetch("http://localhost:8081/auth/auth_token", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        })
            .then(r => r.json())
            .then(r => {
                if (r.username === username){
                    console.log('successfully authenticated.');
                    localStorage.setItem("user", JSON.stringify({username, token: r.accessToken, expiresAt: r.expiresAt, refreshToken: r.refreshToken}))
                    props.setLoggedIn(true)
                    props.setUsername(username)
                    navigate("/")
                } else {
                    console.log("error in authentication " + r.message);
                }
            })
    }, [username, password, navigate, props]);

    const onButtonClick = useCallback(() => {

        // Set initial error values to empty
        setUsernameError("")
        setPasswordError("")

        // Check if the user has entered both fields correctly
        if ("" === username) {
            setUsernameError("Please enter your username")
            return
        }
        if ("" === password) {
            setPasswordError("Please enter a password")
            return
        }
        if (password.length < 7) {
            setPasswordError("The password must be 8 characters or longer")
            return
        }

        // Check if username has an account associated with it
        logIn();


    }, [username, password, logIn]);


    const onPClick = () => {
        navigate('/signup');
    }

    const onForgotPasswordClick = () => {
        // Здесь можно добавить логику для перехода на страницу восстановления пароля
        console.log("Forgot password clicked");
    }

    return (
        <div className={"mainContainer"}>
            <div className="leftSide">
                <div className="logoContainer">
                    <img src={logo} alt="Logo" className="logo" />
                    <p className="logoSubtitle">Your Platform for Future Success</p>
                </div>
            </div>
            <div className="rightSide">
                <div className={"titleContainer"}>
                    <div>Login</div>
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
                        value={"Log in"} />
                </div>
                <div className="forgotPasswordContainer">
                    <p className="forgotPasswordLink" onClick={onForgotPasswordClick}>Forgot password?</p>
                </div>
                <br/>
                <div className={"pContainer"}>
                    <p
                        className={"navigateLogin"}
                        onClick={onPClick}>
                        Sign up!
                    </p>
                </div>
            </div>
        </div>
    );
}