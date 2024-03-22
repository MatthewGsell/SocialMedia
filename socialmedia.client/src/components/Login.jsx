import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

function Login() {
    const email = useRef();
    const password = useRef();
    const [error, setError] = useState();
    const navigate = useNavigate();
    async function databaselogin() {
        const a = await fetch("/login?useCookies=true", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.current.value,
                password: password.current.value,
            }),
        });
        email.current.value = "";
        password.current.value = "";
        if (a.status == 200) {
            navigate("/")
        } else {
            alert("incorrect username or password")
        }
    } 

    return (
        <div id="signlogcontainer">
            <h1>Log In</h1>
            <div id="signlogform">
                <div className="signloginputlabel">Username</div>
                <input id="usernamesignlog" ref={email} />
                <div className="signloginputlabel">Password</div>
                <input id="passwordsignlog" ref={password} />
                <button id="submitbutton" onClick={databaselogin}>
                    Log In!
                </button>
                <p>Not a member?{<Link to="/pages">Sign Up</Link>}</p>
                <p id="signlogerror"></p>
            </div>
        </div>
    );
}

export default Login;