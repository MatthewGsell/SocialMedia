import { useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react";



function MyPage() {
    const postdeletebutton = useRef()
    const profilepictureimage = useRef()
    const aboutmetext = useRef()
    const bannerpictureimage = useRef()
    const [currentUser, setCurrentUser] = useState({})
    const [posts, setPosts] = useState([])
    const [render, setRender] = useState(0)
    const [settingsBox, setSettingsBox] = useState([])
    const [profilePictureBox, setProfilePictureBox] = useState([])
    const [bannerPictureBox, setBannerPictureBox] = useState([])
    const [aboutMeBox, setAboutMeBox] = useState([])
    const [postsrender, setPostsRender] = useState([])
    const [followers, setFollowers] = useState(0)
    const [following, setFollowing] = useState(0)
    const [notificationCount, setNotificationCount] = useState(0)
    const navigate = useNavigate() 
    let likedclass = ""
    let profilepicture = null
    let profilebanner = null
    let aboutme = "Nothing entered for about me section. Please give us a short paragraph to let others know what you're into."

    useEffect(() => {
        isauthorized()
        getnotificationcount()
        getposts()
       

    }, [render])

    useEffect(() => {
        getfollowercounts()
        renderposts()
    }, [currentUser, posts])




    renderprofileimages()


    async function likeordislikepost(postid) {
        const a = await fetch(`/like?postid=${postid}`, {
            method: "POST"
        })
        
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
            } 
    }


    
    async function getfollowercounts() {
        const a = await fetch(`/followercounts?username=${currentUser.userName}`)
        if (a.status == 200) {
            const b = await a.json()
            setFollowers(b.followers)
            setFollowing(b.following)
        }
    }

    async function changeprofilepicture() {
        if (profilepictureimage.current.files != null) {
            const formData = new FormData();
            formData.append("Image", profilepictureimage.current.files[0])
            const a = await fetch("/profilepicture", {
                method: "PUT",
                body: formData
            })
            if (a.status == 200) {
                const newrender = render + 1
                setProfilePictureBox([])
                setRender(newrender)
            } else {
                alert("there was a problem")
            }
        } else  {
            alert("Choose a picture.")
        }
    }

    async function changebannerpicture() {
        if (bannerpictureimage.current.files != null) {
            const formData = new FormData();
            formData.append("Image", bannerpictureimage.current.files[0])
            const a = await fetch("/bannerpicture", {
                method: "PUT",
                body: formData
            })
            if (a.status == 200) {
                const newrender = render + 1
                setBannerPictureBox([])
                setRender(newrender)
            } else {
                alert("there was a problem")
            }
        } else {
            alert("Choose a picture.")
        }
    }

    async function changeaboutme() {
        if (aboutmetext.current.value != null) {
            const formData = new FormData();
            formData.append("Content", aboutmetext.current.value)
            const a = await fetch("/aboutme", {
                method: "PUT",
                body: formData
            })
            if (a.status == 200) {
                const newrender = render + 1
                setAboutMeBox([])
                setRender(newrender)
            } else {
                alert("there was a problem")
            }
        } else {
            alert("Please write something for about me section.")
        }
    }


    function renderprofilepicturebox() {
        setSettingsBox([])
        setProfilePictureBox([<div key={crypto.randomUUID()} id="profilepicturebox"><label htmlFor="imageinput">Choose Image</label><input type="file" id="imageinput" accept="image/png, image/gif, image/jpeg" ref={profilepictureimage} /><button onClick={changeprofilepicture}>Change</button><button onClick={() => setProfilePictureBox([])}>Back</button></div>])

    }


    function renderbannerpicturebox() {
        setSettingsBox([])
        setBannerPictureBox([<div key={crypto.randomUUID()} id="bannerpicturebox"><label htmlFor="imageinput">Choose Image</label><input type="file" id="imageinput" accept="image/png, image/gif, image/jpeg" ref={bannerpictureimage} /><button onClick={changebannerpicture}>Change</button><button onClick={() => { setBannerPictureBox([]) }}>Back</button></div>])
    }



    function renderaboutmebox() {
        setSettingsBox([])
        setAboutMeBox([<div key={crypto.randomUUID()} id="aboutmebox"><textarea ref={aboutmetext} maxLength="200" placeholder="Tell us about yourself...limit 200 characters"></textarea><button onClick={changeaboutme}>Change</button><button onClick={() => { setAboutMeBox([]) }}>Back</button></div>])
    }



    function rendersettings() {
        setSettingsBox([<div key={crypto.randomUUID()} id="settingsbox"><button onClick={renderprofilepicturebox}>Change Profile Picture</button><button onClick={renderbannerpicturebox}>Change Banner Picture</button><button onClick={renderaboutmebox}>Edit About Me</button><button onClick={() => { setSettingsBox([]) }}>Back</button></div>])
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
    }


    async function renderposts() {
        const newpostsrender = []
        if (currentUser) {
            for (let i = 0; i < posts.length; i++) {
                const post = posts[i]
                await isliked(post.id)
                if (post.originalAuthor == null && currentUser.userName == post.author) {
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
                } else if (post.originalAuthor != null && currentUser.userName == post.author) {
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

           

            newpostsrender.reverse()
            setPostsRender(newpostsrender)
        }
    }

    function renderprofileimages() {
        if (currentUser.profilePicture == null) {
            profilepicture = "/src/assets/DefaultProfilePicture.jpg"
        } else {
            profilepicture = `data:image;base64,${currentUser.profilePicture}`
        }
        if (currentUser.bannerPicture == null) {
            profilebanner = "/src/assets/defaultbanner.jpg"
        } else {
            profilebanner = `data:image;base64,${currentUser.bannerPicture}`
        } if (currentUser.aboutMe != null) {
            aboutme = currentUser.aboutMe
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
            window.location.reload();
        }
    }


    return <div id="homecontainer">{settingsBox}{profilePictureBox}{bannerPictureBox}{aboutMeBox}<div id="leftnavbar"><button className="navbutton" onClick={() => { navigate("/") }}>Home</button><button className="navbutton" onClick={() => { navigate("/notifpage") }}>Notifications <span className="notificationcount">{notificationCount > 0 && notificationCount}</span></button><button className="navbutton" onClick={() => { navigate("/search") }}>Search</button><button className="navbutton" onClick={() => { navigate("/inbox") }}>Messages</button><button className="navbutton currentpage" onClick={() => { navigate("/mypage") }}>Profile</button><button className="navbutton" onClick={() => { logout() }}>Log Out</button><button id="newpostbutton" onClick={() => { navigate("/newpost") }}>New Post</button></div><div id="createpostbutton"></div><div id="pagecontent"><div id="profilecontent"><img id="bannerimage" src={profilebanner}></img><div><img id="profilepicture" src={profilepicture}></img><div id="follow"><div><button onClick={
        () => {
            navigate(`/flg/${currentUser.userName}`)
        }
    }>Following</button> {following}</div><div><button onClick={
        () => { navigate(`/flr/${currentUser.userName}`) }
    }>Followers</button> {followers}</div></div><button id="settingsbutton" onClick={rendersettings}>Settings</button><h1>About</h1><p id="aboutme">{aboutme}</p><h1 id="userpostsheader">Users Posts</h1></div></div><ul id="postslist">{postsrender}</ul></div></div>
}


export default MyPage