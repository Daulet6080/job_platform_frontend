import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUsernameError, setEmailError, setPasswordError, clearErrors } from '../store';
import "../styles/LogReg.css";
import logo from '../assets/logo.png';
import { registerUser } from "../services/auth.jsx";

export default function Register(props) {
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checkPasswordValue, setCheckPasswordValue] = useState("");
    const [checkPasswordError, setCheckPasswordError] = useState("");
    const [isFormInvalid, setIsFormInvalid] = useState(false);

    // Используем Redux для ошибок
    const usernameError = useSelector((state) => state.auth.usernameError);
    const emailError = useSelector((state) => state.auth.emailError);
    const passwordError = useSelector((state) => state.auth.passwordError);
    const fullnameError = useSelector((state) => state.auth.usernameError);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onButtonClick = async () => {
        // Сбрасываем ошибки
        dispatch(clearErrors());
        setCheckPasswordError("");
        setIsFormInvalid(false);

        let hasErrors = false;

        // Проверяем обязательные поля
        if ("" === username) {
            dispatch(setUsernameError("Please enter your username"));
            hasErrors = true;
        }

        if ("" === fullname) {
            dispatch(fullnameError("Please enter your full name"));
            hasErrors = true;
        }

        if ("" === email) {
            dispatch(setEmailError("Please enter your email"));
            hasErrors = true;
        }

        if ("" === password) {
            dispatch(setPasswordError("Please enter a password"));
            hasErrors = true;
        }

        if ("" === checkPasswordValue) {
            setCheckPasswordError("This field is required");
            hasErrors = true;
        } else if (password !== checkPasswordValue) {
            setCheckPasswordError("Passwords do not match");
            return; // Прерываем выполнение, если пароли не совпадают
        }

        // Дополнительные проверки (выполняются только если нет ошибок обязательных полей)
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            dispatch(setEmailError("Please enter a valid email"));
            return;
        }

        if (password.length < 7) {
            dispatch(setPasswordError("The password must be 8 characters or longer"));
            return;
        }

        if (hasErrors) {
            setIsFormInvalid(true);
            return;
        }

        try {
            await registerUser(username, fullname, email, password);
            navigate("/login");
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            if (error.response && error.response.data && error.response.data.message) {
                if (error.response.data.message.toLowerCase().includes("username")) {
                    dispatch(setUsernameError(error.response.data.message));
                } else if (error.response.data.message.toLowerCase().includes("email")) {
                    dispatch(setEmailError(error.response.data.message));
                } else {
                    // (общее сообщение об ошибке или обработать конкретные коды ошибок)
                    console.log(error.response.data.message);
                }
            } else {
                // (Ошибка сети или другая непредвиденная ошибка)
                // (общее сообщение об ошибке)
                console.log(error);
            }
        }
    };

    const onPClick = () => {
        navigate("/login");
    };

    const inputClassName = isFormInvalid ? "inputBox invalid" : "inputBox";

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
                    <div>Register</div>
                </div>
                <br/>
                <div className={"inputContainer"}>
                    <input
                        value={username}
                        placeholder="Enter your username here"
                        onChange={ev => setUsername(ev.target.value)}
                        className={inputClassName}/>
                    <label className="errorLabel">{usernameError}</label>
                </div>
                <br/>
                <div className={"inputContainer"}>
                    <input
                        value={fullname}
                        placeholder="Enter your full name here"
                        onChange={ev => setFullname(ev.target.value)}
                        className={inputClassName}/>
                </div>
                <br/>
                <div className={"inputContainer"}>
                    <input
                        value={email}
                        placeholder="Enter your email here"
                        onChange={ev => setEmail(ev.target.value)}
                        className={inputClassName}/>
                    <label className="errorLabel">{emailError}</label>
                </div>
                <br/>
                <div className={"inputContainer"}>
                    <input
                        value={password}
                        type="password"
                        placeholder="Enter your password here"
                        onChange={ev => setPassword(ev.target.value)}
                        className={inputClassName}/>
                    <label className="errorLabel">{passwordError}</label>
                </div>
                <br/>
                <div className={"inputContainer"}>
                    <input
                        value={checkPasswordValue}
                        type="password"
                        placeholder="Confirm your password"
                        onChange={ev => setCheckPasswordValue(ev.target.value)}
                        className={inputClassName}/>
                    <label className="errorLabel">{checkPasswordError}</label>
                </div>
                <br/>
                <div className={"inputContainer"}>
                    <input
                        className={"inputButton"}
                        type="button"
                        onClick={onButtonClick}
                        value={"Sign up"}/>
                </div>
                {isFormInvalid && <p className="requiredFields">All fields are required</p>}
                <br/>
                <div className={"pContainer"}>
                    <p
                        className={"navigateLogin"}
                        onClick={onPClick}>
                        Log in!
                    </p>
                </div>
            </div>
        </div>
    );
}