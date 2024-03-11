import { useParams, useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react";



function Comments() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [comments, setComments] = useState([])
    const [currentUser, setCurrentUser] = useState()
    const [render, setRender] = useState(0)
    const commentsRender = []
    const newcommenttext = useRef()
 

    useEffect(() => {
        getcomments()
        isauthorized()
    }, [render])


    rendercomments()

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
        comments.forEach((comment) => {
            if (comment.author != currentUser.userName) {
                commentsRender.push(<li key={crypto.randomUUID()} id={comment.id} className="comment"><p>{comment.content}</p></li>)
            } else {
                commentsRender.push(<li key={crypto.randomUUID()} id={comment.id} className="comment"><p>{comment.content}</p><button onClick={deletecomment}>Delete</button></li>)
            }
            
        })
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


    return <div><ul id="commentslist"></ul><div id="postcommentcontainer"><ul>{commentsRender}</ul><textarea ref={newcommenttext} placeholder="add a comment..."></textarea><button onClick={postcomment}>Post</button><button onClick={() => { navigate("/") } }>Back</button></div></div>
}

export default Comments;