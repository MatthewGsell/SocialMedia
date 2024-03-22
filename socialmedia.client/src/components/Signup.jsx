import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

function Signup() {
    const username = useRef();
    const password = useRef();
    const [error, setError] = useState();
    const navigate = useNavigate();
    async function databasesignup() {
        const a = await fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username.current.value,
                password: password.current.value
            }),
        });
        username.current.value = ""
        password.current.value = "";
        if (a.status == 200) {
            navigate("/pagel");
           
        } else if (a.status == 409) {
            alert("username already exists")
        }
        else {
            alert("Error: Passowrds must contain only one uppercase character, lowercase character, a digit, and a non-alphanumeric character. Passwords must be at least six characters long.")
        }
    }

    return (
        <div id="signlogcontainer">
            <h1>Sign Up</h1>
            <div id="signlogform">
                <div className="signloginputlabel">Username</div>
                <input id="usernamesignlog" ref={username} />
                <div className="signloginputlabel">Password</div>
                <input id="passwordsignlog" ref={password} />
                <button id="submitbutton" onClick={databasesignup}>
                    Sign Up!
                </button>
                <p>Already a member?{<Link to="/pagel">Log In</Link>}</p>
                <p id="signlogerror"></p>
            </div>
        </div>
    );
}

export default Signup;