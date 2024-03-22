import { useRef } from "react";
import { useNavigate } from "react-router-dom"



function NewPost() {
    const posttext = useRef()
    const postimage = useRef()
    const navigate = useNavigate();

    async function submitpost() {
        if (postimage.current.files != null) {
            const formData = new FormData();
            formData.append("Content", posttext.current.value)
            formData.append("Image", postimage.current.files[0])
            const a = await fetch("/posts", {
                method: "POST",
                body: formData
            })
            if (a.status == 200) {
                navigate("/")
            } else {
                alert("there was a problem")
            }
        } else if (posttext.current.value != null) {
            const a = await fetch("/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Content: posttext.current.value,
                  
                })
            })
            if (a.status == 200) {
                navigate("/")
            } else {
                alert("there was a problem")
            }
        }
        
    }



    return <div id="postcontainer"><div id="newpostform"><textarea placeholder="write your post here..." ref={posttext}></textarea><label htmlFor="imageinput">Choose Image</label><input type="file" id="imageinput" accept="image/png, image/gif, image/jpeg" ref={postimage} /><button onClick={submitpost}>Post</button ></div><button id="cancelpostbutton" onClick={() => {
        navigate("/")
    } }>Cancel</button></div>
}




export default NewPost;