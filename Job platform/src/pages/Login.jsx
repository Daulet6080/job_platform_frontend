import React, {useCallback, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/LogReg.css";
import logo from '../assets/logo.png';
import { loginUser } from '../services/auth.jsx';

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();

    const onButtonClick = useCallback(async () => {
        setUsernameError("");
        setPasswordError("");

        if ("" === username) {
            setUsernameError("Please enter your username");
            return;
        }
        if ("" === password) {
            setPasswordError("Please enter a password");
            return;
        }
        if (password.length < 7) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }

        try {
            const userData = await loginUser(username, password);
            localStorage.setItem("user", JSON.stringify({
                username: userData.username,
                token: userData.accessToken,
                expiresAt: userData.expiresAt,
                refreshToken: userData.refreshToken
            }));
            props.setLoggedIn(true);
            props.setUsername(username);
            navigate("/");
        } catch (error) {
            console.error("Ошибка логина:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setUsernameError(error.response.data.message);
                setPasswordError(error.response.data.message);
            } else {
                setUsernameError("Invalid username or password");
                setPasswordError("Invalid username or password");
            }
        }
    }, [username, password, navigate, props]);


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
                <div className="forgotPasswordContainer">
                    <p className="forgotPasswordLink" onClick={onForgotPasswordClick}>Forgot password?</p>
                </div>
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