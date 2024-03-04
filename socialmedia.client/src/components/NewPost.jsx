import { useRef } from "react";
import { useNavigate } from "react-router-dom"



function NewPost() {
    const posttext = useRef()
    const postimage = useRef()
    const navigate = useNavigate();

    async function submitpost() {
        const a = await fetch("/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Content: posttext.current.value,
                Image: postimage.current.value
            })
        })
        if (a.status == 200) {
            navigate("/")
        } else {
            alert("there was a problem")
        }
    }



    return <div id="postcontainer"><div id="newpostform"><textarea placeholder="write your post here..." ref={posttext}></textarea><label htmlFor="imageinput">Choose Image</label><input type="file" id="imageinput" accept="image/png, image/gif, image/jpeg" ref={postimage} /><button onClick={submitpost}>Post</button ></div><button id="cancelpostbutton" onClick={() => {
        navigate("/")
    } }>Cancel</button></div>
}




export default NewPost;