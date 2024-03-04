import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";


function Home() {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        setTimeout(isauthorized, 3000)
        setTimeout(getposts, 4000)

    })


    async function isauthorized() {
        const a = await fetch("/pingauth");
        if (a.status != 200) {
            navigate("/login")
        }
        const username = await a.json()
        console.log(username)
 
    }

    async function getposts() {
        const a = await fetch("/posts"); 
        const b = await a.json(); 

        console.log(b)
    }

    async function logout() {
        const a = await fetch("/logout")
        if (a.status == 200) {
            window.location.reload();
        }
    }


    return <div id="homecontainer"><div id="leftnavbar"><button className="navbutton">Home</button><button className="navbutton">Messages</button><button className="navbutton">Profile</button><button className="navbutton" onClick={() => { logout() } }>Log Out</button><button id="newpostbutton" onClick={() => { navigate("newpost") }}>New Post</button></div><div id="createpostbutton"></div><div id="pagecontent"><ul id="postslist"></ul></div></div>
}

export default Home