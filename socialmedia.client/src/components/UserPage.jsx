import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react";



function UserPage() {
    const { username } = useParams()
    const postdeletebutton = useRef()
    const [theUser, setTheUser] = useState({})
    const [currentUser, setCurrentUser] = useState({})
    const [posts, setPosts] = useState([])
    const [render, setRender] = useState(0)
    const [settingsBox, setSettingsBox] = useState([])
    const [profilePictureBox, setProfilePictureBox] = useState([])
    const [bannerPictureBox, setBannerPictureBox] = useState([])
    const [postsrender, setPostsRender] = useState()
    const [aboutMeBox, setAboutMeBox] = useState([])
    const [followsText, setFollowsText] = useState("")
    const [followers, setFollowers] = useState(0)
    const [following, setFollowing] = useState(0)
    const [notificationCount, setNotificationCount] = useState(0)
    const navigate = useNavigate()
    let likedclass = ""
    let profilepicture = null
    let profilebanner = null
    let aboutme = "This user has not added an about me section yet."

    useEffect(() => {
        isauthorized()
        gettheuser()
        getnotificationcount()
        getposts()
        isfollowing()
        getfollowercounts()

    }, [render])
    useEffect(() => {
        getfollowercounts()
        renderposts()
    }, [theUser, posts])
  
    renderprofileimages()
    checkifuser()


    async function likeordislikepost(postid) {
        const a = await fetch(`/like?postid=${postid}`, {
            method: "POST"
        })
        if (a.status == 200) {



        } else {
            alert("there was a problem")
        }
    }


    async function checkifuser() {
        if (currentUser.userName == theUser.userName && currentUser.username != null) {
            navigate("/mypage")
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


    async function getnotificationcount() {
        const a = await fetch('/notificationcount')

        if (a.status == 200) {
            const b = await a.json()
            setNotificationCount(b.count)
        } 

    }


    async function isliked(postid) {
        const a = await fetch(`/like?postid=${postid}`)
        if (a.status == 200) {
            const b = await a.json()
            likedclass = b.isliked

        } else {
            alert("there was a problem")
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
            alert("post shared")
        } 
    }
  




    async function getfollowercounts() {
        const a = await fetch(`/followercounts?username=${username}`)
        if (a.status == 200) {
            const b = await a.json()
            setFollowers(b.followers)
            setFollowing(b.following)
        }
    }


    async function isfollowing() {
        const a = await fetch(`/following?username=${username}`)
        const b = await a.json()
        if (b.following == false) {
            setFollowsText("Follow")
        } else {
            setFollowsText("Unfollow")
        }
    }
    async function follow() {
        const a = await fetch(`/follow?username=${username}`, {
            method: "POST"
        })
        if (a.status == 200) {
            const newrender = render + 1
            setRender(newrender)
        } else {
            alert("there was a problem")
        }
    }

    async function unfollow() {
        const a = await fetch(`/follow?username=${username}`, {
            method: "DELETE"
        })
        if (a.status == 200) {
            const newrender = render + 1
            setRender(newrender)
        } else {
            alert("there was a problem")
        }
    }

    async function gettheuser() {
        const a = await fetch(`/singleuser?username=${username}`)

        if (a.status == 200) {
          const b = await a.json()
            setTheUser(b.user)
     
        } else {
            alert("there was a problem")
        }
    }



    async function getposts() {
        const a = await fetch(`/singleuserposts?username=${username}`);
        const b = await a.json()  
        setPosts(b.postList)
    }


    async function renderposts() {
        const newpostsrender = []
        if (theUser) {
            for (let i = 0; i < posts.length; i++) {
                const post = posts[i]
                await isliked(post.id)
                if (post.originalAuthor == null && theUser.userName == post.author) {
                    if (post.image != null && post.originalAuthor == null) {
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
                        newpostsrender.push([<li key={crypto.randomUUID()} className="postdiv" id={post.id}><p className="postauthor">{post.author}</p><p className="postcontent">{post.content}</p><div><div><button onClick={(e) => {
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
                } else if (post.originalAuthor != null && theUser.userName == post.author) {
                    if (post.image != null && post.originalAuthor != null) {
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
                        newpostsrender.push([<li key={crypto.randomUUID()} className="postdiv" id={post.id}><p className="postauthor">{post.author}<span className="sharedfrom"> shared </span>{post.originalAuthor}'s<span className="sharedfrom">post</span></p><p className="postcontent">{post.content}</p><div><div><button onClick={(e) => {
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
                }

            }



            newpostsrender.reverse()
            setPostsRender(newpostsrender)
        }
    }

    function renderprofileimages() {
        if (theUser.profilePicture == null) {
            profilepicture = "../../DefaultProfilePicture.jpg"
        } else {
            profilepicture = `data:image;base64,${theUser.profilePicture}`
        }
        if (theUser.bannerPicture == null) {
            profilebanner = "../../defaultbanner.jpg"
        } else {
            profilebanner = `data:image;base64,${theUser.bannerPicture}`
        } if (theUser.aboutMe != null) {
            aboutme = theUser.aboutMe
        }
    }

    async function logout() {
        const a = await fetch("/logout")
        if (a.status == 200) {
            window.location.reload()
        }
    }


    return <div id="homecontainer"><div id="leftnavbar"><button className="navbutton" onClick={() => { navigate("/") }}>Home</button><button className="navbutton" onClick={() => { navigate("/notifpage") }}>Notifications <span className="notificationcount">{notificationCount > 0 && notificationCount}</span></button><button className="navbutton" onClick={() => { navigate("/search") }}>Search</button><button className="navbutton" onClick={() => { navigate("/inbox") }}>Messages</button><button className="navbutton" onClick={() => { navigate("/mypage") }}>Profile</button><button className="navbutton" onClick={() => { logout() }}>Log Out</button><button id="newpostbutton" onClick={() => { navigate("/newpost") }}>New Post</button></div><div id="createpostbutton"></div><div id="pagecontent"><div id="profilecontent"><img id="bannerimage" src={profilebanner}></img><div><img id="profilepicture" src={profilepicture}></img><div id="follow"><div><button onClick={
        () => { navigate(`/flg/${theUser.userName}`) }
    }>Following</button> {following}</div><div><button onClick={
        () => { navigate(`/flr/${theUser.userName}`) }
    }>Followers</button> {followers}</div></div><button onClick={() => {
        if (followsText == "Follow") {
            follow()
        } else {
            unfollow()
            }
        }} id="followbutton" className={followsText}>{followsText}</button><button id="messagebutton" onClick={() => { navigate(`/dm/${theUser.userName}`) }}>Message</button><h1>About</h1><p id="aboutme">{aboutme}</p><h1 id="userpostsheader">Users Posts</h1></div></div><ul id="postslist">{postsrender}</ul></div></div>
}


export default UserPage