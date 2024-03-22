import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react";

function Following() {
    const { username } = useParams();

    const [followings, setFollowings] = useState([])
    const [currentUser, setCurrentUser] = useState()
    const [followingsRender, setFollowingsRender] = useState([<h1 key={crypto.randomUUID()}>Loading...</h1>])
    const navigate = useNavigate()


    useEffect(() => {
        isauthorized();
        getfollowings();

    }, [])


    useEffect(() => {
        renderfollowings()
    }, [followings, currentUser])




    async function isauthorized() {
        const a = await fetch("/pingauth");
        if (a.status != 200) {
            navigate("/pagel")
        } else {
            const b = await a.json()
            setCurrentUser(b.currentUser)
        }


    }



    async function getfollowings() {
        const a = await fetch(`/followings?username=${username}`)

        if (a.status == 200) {
            const b = await a.json()
            setFollowings(b.following)
        }
    }

    async function renderfollowings() {
        let newfollowingsrender = []



        followings.forEach((following) => {
            newfollowingsrender.push([<li key={crypto.randomUUID()}><p>{following.user}</p><button onClick={() => {
                if (following.user == currentUser.userName) {
                    navigate("/mypage")
                } else {
                    navigate(`/userpage/${following.user}`)
                }

            }}>Go to page</button></li>])
        })

        if (newfollowingsrender.length > 0) {
            setFollowingsRender(newfollowingsrender)
        } else {
            setFollowingsRender([<h3 key={crypto.randomUUID()}>Following None</h3>])
        }




    }


    return <div id="followersfollowingscontainer"><h1>Following</h1><ul>{followingsRender}</ul><button onClick={() => { navigate(-1) }}>Back</button></div>
}



export default Following