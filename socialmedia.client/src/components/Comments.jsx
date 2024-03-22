import { useParams, useNavigate } from "react-router-dom"
import { useState, useRef, useEffect, useLayoutEffect } from "react";



function Comments() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [comments, setComments] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const [render, setRender] = useState(0)
    const [commentsRender, setCommentsRender] = useState([])
    const [post, setPost] = useState("")
    const newcommenttext = useRef()
    let likedclass = ""
 

    useEffect(() => {

        isauthorized()
        getsinglepost()
        getcomments()
       
    }, [render])


    useLayoutEffect(() => {
        rendercomments()
    }, [comments, currentUser])




    async function getsinglepost() {
        const a = await fetch(`/singlepost?postid=${id}`)

        if (a.status == 200) {
            const b = await a.json()
            setPost(b.post)
        } else {
            alert("issue getting post content")
        }
    }





    async function isliked(commentid) {
        const a = await fetch(`/likecomment?commentid=${commentid}`)
        if (a.status == 200) {
            
            const b = await a.json()
        
            likedclass = b.isliked


        } else {
            alert("there was a problem")
        }
    }

    async function likeordislikecomment(commentid) {
        const a = await fetch(`/likecomment?commentid=${commentid}`, {
            method: "POST"
        })
        if (a.status == 200) {



        } else {
            alert("there was a problem")
        }
    }


    async function isauthorized() {
        const a = await fetch("/pingauth");
        if (a.status != 200) {
            navigate("/login")
        } else {
            const b = await a.json()
            setCurrentUser(b.currentUser)
        }


    }



    async function getcomments() {
        const a = await fetch(`/comments?post=${id}`)
        const b = await a.json()
        setComments(b.commentslist)

    }

    async function rendercomments() {
       
        const newcommentsrender = []
        if (currentUser) {
            for (let i = 0; i < comments.length; i++) {
                const comment = comments[i]
                await isliked(comment.id)
                if (comment.author != currentUser.userName) {
                    newcommentsrender.push(<li key={crypto.randomUUID()} id={comment.id}><p>{comment.content}</p><div className="commentsbuttons"><button onClick={(e) => {
                        if (e.target.className == "liked") {
                            e.target.className = ""
                            const newvalue = parseInt(e.target.nextSibling.textContent) - 1
                            e.target.nextSibling.textContent = newvalue.toString()
                        } else {
                            e.target.className = "liked"
                            const newvalue = parseInt(e.target.nextSibling.textContent) + 1
                            e.target.nextSibling.textContent = newvalue.toString()
                        } likeordislikecomment(comment.id)
                    }} className={likedclass}>Like</button><span>{comment.likes.toString()}</span>Likes</div></li>)
                } else {
                    newcommentsrender.push(<li key={crypto.randomUUID()} id={comment.id}><p>{comment.content}</p><div className="commentsbuttons"><button onClick={(e) => {
                        if (e.target.className == "liked") {
                            e.target.className = ""
                            const newvalue = parseInt(e.target.nextSibling.textContent) - 1
                            e.target.nextSibling.textContent = newvalue.toString()
                        } else {
                            e.target.className = "liked"
                            const newvalue = parseInt(e.target.nextSibling.textContent) + 1
                            e.target.nextSibling.textContent = newvalue.toString()
                        } likeordislikecomment(comment.id)
                    }} className={likedclass}>Like</button><span>{comment.likes.toString()}</span>Likes<button onClick={deletecomment} className="deletecommentbutton">Delete</button></div></li>)
                }

            }

            
        }
        setCommentsRender([newcommentsrender])
      
    }

    async function postcomment() {
        const a = await fetch(`/comments?post=${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Content: newcommenttext.current.value,
                PostId: id
            })
        })
        newcommenttext.current.value = ""
        const num = render + 1
        setRender(num)
    }

    async function deletecomment(e) {
        const a = await fetch(`/comments`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Id: e.target.parentElement.id
            })
        })

        if (a.status == 200) {
            const newrender = render + 1
            setRender(newrender)
        } else {
            alert("there was a problem")
        }
    }


    return <div id="postcommentcontainer"><div id="postcontent">Post: {post.content}</div><div>{post.likes} likes {post.shares} shares</div><ul id="commentlist">{commentsRender}</ul><div id="newcommentcontainer"><textarea ref={newcommenttext} placeholder="add a comment..."></textarea><button onClick={postcomment}>Post</button><button onClick={() => { navigate(-1) }}>Back</button></div></div>
}

export default Comments;