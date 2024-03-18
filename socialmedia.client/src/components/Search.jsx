import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Search() {
    const [query, setQuery] = useState();
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({})
    let filteredusers = [];
    const navigate = useNavigate();
    useEffect(() => {
        getusers();
        isauthorized();
    }, []);
    filterusers();

    async function isauthorized() {
        const a = await fetch("/pingauth");
        if (a.status != 200) {
            navigate("/login")
        } else {
            const b = await a.json()
            setCurrentUser(b.currentUser)
        }


    }


    async function getusers() {
        const a = await fetch("/users", {
            method: "GET"
        });
        const b = await a.json();
        console.log(b)
        setUsers(b.userlist);
    }
    function filterusers() {
        users.forEach((user) => {
            if (user.userName.includes(query) && query.length > 0) {
                filteredusers.push(
                    <div
                        id={user.id}
                        key={crypto.randomUUID()}
                        onClick={() => {
                            if (currentUser.userName == user.userName) {
                                navigate("/mypage")
                            } else {
                                navigate(`/userpage/${user.userName}`)
                            }
                        }}
                    >
                        {user.userName}
                    </div>
                );
            }
        });
    }
    
    return (
        <div id="newmessagecontainer">
            <h1 className="nothingopened">Search for a User</h1>
            <input
                id="usernameinput"
                type="text"
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
            ></input>
            <div id="filteredusers">{filteredusers}</div>
        </div>
    );
}

export default Search;