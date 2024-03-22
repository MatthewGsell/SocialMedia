import { useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react";


function Home() {
    const postdeletebutton = useRef()
    const [currentUser, setCurrentUser] = useState({})
    const [posts, setPosts] = useState([])
    const [render, setRender] = useState(0)
    const [notificationCount, setNotificationCount] = useState(0)
    const [reloadPosts, setReloadPosts] = useState(0)
    const navigate = useNavigate()
    const [postsrender, setPostsRender] = useState([<li key={crypto.randomUUID()}><h1>Loading...</h1></li>])
    let likedclass = ""

    useEffect(() => {
        isauthorized()
        getnotificationcount()
       getposts()
   
    }, [render])

    useEffect(() => {
        renderposts()
    }, [posts, currentUser])


    async function getnotificationcount() {
        const a = await fetch('/notificationcount')

        if (a.status == 200) {
            const b = await a.json()
            setNotificationCount(b.count)
        } 

    }




    async function likeordislikepost(postid) {
        const a = await fetch(`/like?postid=${postid}`, {
            method: "POST"
        })
       
    }

    async function isliked(postid) {
        const a = await fetch(`/like?postid=${postid}`)
        if (a.status == 200) {
            const b = await a.json()
            likedclass = b.isliked

        } 
    }




    async function sharepost(e) {
        
            const formData = new FormData();
            formData.append("OriginalAuthor", e.target.id)
            formData.append("OriginalId", e.target.parentElement.id)
            const a = await fetch("/posts", {
                method: "POST",
                body: formData
            })
        if (a.status == 200) {
            window.location.reload()
            } else {
                alert("there was a problem")
            }
    }









    async function isauthorized() {
        const a = await fetch("/pingauth");
        if (a.status != 200) {
            navigate("/pagel")
        } else {
            const b = await a.json()
            setCurrentUser(b.currentUser)
        }
        
 
    }

    async function getposts() {
        const a = await fetch("/posts");
        const b = await a.json()
        setPosts(b.postList)
        setPostsRender([])
       
    }

    async function renderposts() {
        const newpostsrender = []
        if (currentUser && posts.length > 0) {
            for (let i = 0; i < posts.length; i++) {
                const post = posts[i]
                await isliked(post.id)
                if (currentUser.userName != post.author && post.originalAuthor == null) {
                    if (post.image != null) {
                        newpostsrender.push([<li key={crypto.randomUUID()} className="postdiv" id={post.id}><p className="postauthor">{post.author}</p><p className="postcontent">{post.content}</p><img src={`data:image;base64,${post.image}`}></img><div><div><button onClick={(e) => {
                            if (e.target.className == "liked") {
                                e.target.className = ""
                                const newvalue = parseInt(e.target.nextSibling.textContent) - 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } else {
                               
                                e.target.className = "liked"
                                const newvalue = parseInt(e.target.nextSibling.textContent) + 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } likeordislikepost(post.id)
                        }} className={likedclass}>Like</button><span>{post.likes.toString()}</span> likes</div><div><button onClick={(e) => { navigate("/post/" + e.target.parentElement.parentElement.parentElement.id) }}>Comment</button>{post.comments.toString()} comments</div><div id={post.id}><button id={post.author} onClick={sharepost}>Share</button>{post.shares.toString()} shares</div></div></li>])
                    } else {
                        newpostsrender.push([<li key={crypto.randomUUID()} className="postdiv" id={post.id}><p className="postauthor">{post.author}</p><p className="postcontent">{post.content}</p> <div><div><button onClick={(e) => {
                            if (e.target.className == "liked") {
                                e.target.className = ""
                                const newvalue = parseInt(e.target.nextSibling.textContent) - 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } else {
                                

                                e.target.className = "liked"
                                const newvalue = parseInt(e.target.nextSibling.textContent) + 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } likeordislikepost(post.id)
                        }} className={likedclass}>Like</button><span>{post.likes.toString()}</span> likes</div><div><button onClick={(e) => { navigate("/post/" + e.target.parentElement.parentElement.parentElement.id) }}>Comment</button>{post.comments.toString()} comments</div><div id={post.id}><button id={post.author} onClick={sharepost}>Share</button>{post.shares.toString()} shares</div></div></li>])
                    }
                } else if(post.originalAuthor == null) {
                    if (post.image != null && post.originalAuthor == null) {
                        newpostsrender.push([<li key={crypto.randomUUID()} className="postdiv" id={post.id}><p className="postauthor">{post.author}</p><p className="postcontent">{post.content}</p><img src={`data:image;base64,${post.image}`}></img><div><div><button onClick={(e) => {
                            if (e.target.className == "liked") {
                                e.target.className = ""
                                const newvalue = parseInt(e.target.nextSibling.textContent) - 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } else {
                                const notificationcount = document.querySelector(".notificationcount")
                                let newcount = 0
                                if (notificationcount.textContent) {
                                    newcount = parseInt(notificationcount.textContent) + 1
                                } else {
                                    newcount = 1
                                }
                                notificationcount.innerText = newcount.toString()
                                e.target.className = "liked"
                                const newvalue = parseInt(e.target.nextSibling.textContent) + 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } likeordislikepost(post.id)
                        }} className={likedclass}>Like</button><span>{post.likes.toString()}</span> likes</div><div><button onClick={(e) => { navigate("/post/" + e.target.parentElement.parentElement.parentElement.id) }}>Comment</button>{post.comments.toString()} comments</div><div id={post.id}><button id={post.author} onClick={sharepost}>Share</button>{post.shares.toString()} shares</div><button onClick={deletepost}>Delete</button></div></li>])
                    } else {
                        newpostsrender.push([<li key={crypto.randomUUID()} className="postdiv" id={post.id}><p className="postauthor">{post.author}</p><p className="postcontent">{post.content}</p><div><div><button onClick={(e) => {
                            if (e.target.className == "liked") {
                                e.target.className = ""
                                const newvalue = parseInt(e.target.nextSibling.textContent) - 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } else {
                                const notificationcount = document.querySelector(".notificationcount")
                                let newcount = 0
                                if (notificationcount.textContent) {
                                    newcount = parseInt(notificationcount.textContent) + 1
                                } else {
                                    newcount = 1
                                }
                                notificationcount.innerText = newcount.toString()
                                e.target.className = "liked"
                                const newvalue = parseInt(e.target.nextSibling.textContent) + 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } likeordislikepost(post.id)
                        }} className={likedclass}>Like</button><span>{post.likes.toString()}</span> likes</div><div><button onClick={(e) => { navigate("/post/" + e.target.parentElement.parentElement.parentElement.id) }}>Comment</button>{post.comments.toString()} comments</div><div id={post.id}><button id={post.author} onClick={sharepost}>Share</button>{post.shares.toString()} shares</div><button onClick={deletepost}>Delete</button></div></li>])
                    }
                } if (currentUser.userName != post.author && post.originalAuthor != null) {
                    if (post.image != null) {
                        newpostsrender.push([<li key={crypto.randomUUID()} className="postdiv" id={post.id}><p className="postauthor">{post.author}<span className="sharedfrom"> shared </span>{post.originalAuthor}'s<span className="sharedfrom">post</span></p><p className="postcontent">{post.content}</p><img src={`data:image;base64,${post.image}`}></img><div><div><button onClick={(e) => {
                            if (e.target.className == "liked") {
                                e.target.className = ""
                                const newvalue = parseInt(e.target.nextSibling.textContent) - 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } else {
                                
                                e.target.className = "liked"
                                const newvalue = parseInt(e.target.nextSibling.textContent) + 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } likeordislikepost(post.id)
                        }} className={likedclass}>Like</button><span>{post.likes.toString()}</span> likes</div><div><button onClick={(e) => { navigate("/post/" + e.target.parentElement.parentElement.parentElement.id) }}>Comment</button>{post.comments.toString()} comments</div><div id={post.originalId}><button id={post.originalAuthor} onClick={sharepost}>Share</button></div></div></li>])
                    } else {
                        newpostsrender.push([<li key={crypto.randomUUID()} className="postdiv" id={post.id}><p className="postauthor">{post.author}<span className="sharedfrom"> shared </span>{post.originalAuthor}'s<span className="sharedfrom">post</span></p><p className="postcontent">{post.content}</p> <div><div><button onClick={(e) => {
                            if (e.target.className == "liked") {
                                e.target.className = ""
                                const newvalue = parseInt(e.target.nextSibling.textContent) - 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } else {
                               
                                e.target.className = "liked"
                                const newvalue = parseInt(e.target.nextSibling.textContent) + 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } likeordislikepost(post.id)
                        }} className={likedclass}>Like</button><span>{post.likes.toString()}</span> likes</div><div><button onClick={(e) => { navigate("/post/" + e.target.parentElement.parentElement.parentElement.id) }}>Comment</button>{post.comments.toString()} comments</div><div id={post.originalId}><button id={post.originalAuthor} onClick={sharepost}>Share</button></div></div></li>])
                    }
                } else if (post.originalAuthor != null) {
                    if (post.image != null && post.originalAuthor != null) {
                        newpostsrender.push([<li key={crypto.randomUUID()} className="postdiv" id={post.id}><p className="postauthor">{post.author}<span className="sharedfrom"> shared </span>{post.originalAuthor}'s<span className="sharedfrom">post</span></p><p className="postcontent">{post.content}</p><img src={`data:image;base64,${post.image}`}></img><div><div><button onClick={(e) => {
                            if (e.target.className == "liked") {
                                e.target.className = ""
                                const newvalue = parseInt(e.target.nextSibling.textContent) - 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } else {
                                const notificationcount = document.querySelector(".notificationcount")
                                let newcount = 0
                                if (notificationcount.textContent) {
                                    newcount = parseInt(notificationcount.textContent) + 1
                                } else {
                                    newcount = 1
                                }
                                notificationcount.innerText = newcount.toString()
                                e.target.className = "liked"
                                const newvalue = parseInt(e.target.nextSibling.textContent) + 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } likeordislikepost(post.id)
                        }} className={likedclass}>Like</button><span>{post.likes.toString()}</span> likes</div><div><button onClick={(e) => { navigate("/post/" + e.target.parentElement.parentElement.parentElement.id) }}>Comment</button>{post.comments.toString()} comments</div><div id={post.originalId}><button id={post.originalAuthor} onClick={sharepost}>Share</button></div><button onClick={deletepost}>Delete</button></div></li>])
                    } else {
                        newpostsrender.push([<li key={crypto.randomUUID()} className="postdiv" id={post.id}><p className="postauthor">{post.author}<span className="sharedfrom"> shared </span>{post.originalAuthor}'s<span className="sharedfrom">post</span></p><p className="postcontent">{post.content}</p><div><div><button onClick={(e) => {
                            if (e.target.className == "liked") {
                                e.target.className = ""
                                const newvalue = parseInt(e.target.nextSibling.textContent) - 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } else {
                                const notificationcount = document.querySelector(".notificationcount")
                                let newcount = 0
                                if (notificationcount.textContent) {
                                    newcount = parseInt(notificationcount.textContent) + 1
                                } else {
                                    newcount = 1
                                }
                                notificationcount.innerText = newcount.toString()
                                e.target.className = "liked"
                                const newvalue = parseInt(e.target.nextSibling.textContent) + 1
                                e.target.nextSibling.textContent = newvalue.toString()
                            } likeordislikepost(post.id)
                        }} className={likedclass}>Like</button><span>{post.likes.toString()}</span> likes</div><div><button onClick={(e) => { navigate("/post/" + e.target.parentElement.parentElement.parentElement.id) }}>Comment</button>{post.comments.toString()} comments</div><div id={post.originalId}><button id={post.originalAuthor} onClick={sharepost}>Share</button></div><button onClick={deletepost}>Delete</button></div></li>])
                    }
                }

            }

            if (newpostsrender.length > 0) {
                newpostsrender.reverse()
                setPostsRender(newpostsrender)
            } else {
                setPostsRender([<h1 key={crypto.randomUUID()}>No Posts Yet</h1>])
            }

            
            
           
        }
        
       
    }

    async function deletepost(e) {
        const a = await fetch(`/posts`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Id: e.target.parentElement.parentElement.id
            })
        })
        if (a.status == 200) {
            window.location.reload();
        } else {
            alert("there was a problem")
        }
    }



    async function logout() {
        const a = await fetch("/logout")
        if (a.status == 200) {
            window.location.reload()
        }
    }


    return <div id="homecontainer"><div id="leftnavbar"><button className="navbutton currentpage" onClick={() => { navigate("/") }}>Home</button><button className="navbutton" onClick={() => { navigate("/notifpage") }}>Notifications <span className="notificationcount">{notificationCount > 0 && notificationCount}</span></button><button className="navbutton" onClick={() => { navigate("/search") }}>Search</button><button className="navbutton" onClick={() => {navigate("/inbox") } }>Messages</button><button className="navbutton" onClick={() => { navigate("/mypage") }}>Profile</button><button className="navbutton" onClick={() => { logout() }}>Log Out</button><button id="newpostbutton" onClick={() => { navigate("newpost") }}>New Post</button></div><div id="createpostbutton"></div><div id="pagecontent"><ul id="postslist">{postsrender}</ul></div></div>
}

export default Home