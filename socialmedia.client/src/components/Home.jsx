import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";


function Home() {
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()
    let postsrender = []

    useEffect(() => {
      isauthorized()
       getposts()

    },[])

    renderposts()

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
        const b = await a.json()
        console.log(b)
        setPosts(b.postList)
    }

    function renderposts() {
        posts.forEach((post) => {
            console.log(post.id)
            if (post.image != null) {
                postsrender.push([<li key={crypto.randomUUID()} className="postdiv" id={post.id}><p>{post.content}</p><img src={`data:image;base64,${post.image}`}></img><div><button>Like</button>{post.likes.toString()} likes</div><div><button onClick={(e) => { navigate("/comments/" + e.target.parentElement.parentElement.id) }}>Comment</button>{post.comments.toString()} comments</div><div><button>Share</button>{post.shares.toString()} shares</div></li>])
            } else {
                postsrender.push([<div key={crypto.randomUUID()} className="postdiv" id={post.id}><p>{post.content}</p></div>])
            }
            
        })
    }



    async function logout() {
        const a = await fetch("/logout")
        if (a.status == 200) {
            window.location.reload();
        }
    }


    return <div id="homecontainer"><div id="leftnavbar"><button className="navbutton">Home</button><button className="navbutton">Messages</button><button className="navbutton">Profile</button><button className="navbutton" onClick={() => { logout() }}>Log Out</button><button id="newpostbutton" onClick={() => { navigate("newpost") }}>New Post</button></div><div id="createpostbutton"></div><div id="pagecontent"><ul id="postslist">{postsrender}</ul></div></div>
}

export default Home