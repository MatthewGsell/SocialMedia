import {  Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react";


function Followers() {

   const { username } = useParams();

    const [followers, setFollowers] = useState([])
    const [currentUser, setCurrentUser] = useState()
    const [followersRender, setFollowersRender] = useState([<h1 key={crypto.randomUUID()}>Loading...</h1>])
    const navigate = useNavigate()


    useEffect(() => {
        isauthorized();
        getfollowers();
   
    }, [])


    useEffect(() => {
        renderfollowers()
    }, [followers, currentUser])




    async function isauthorized() {
        const a = await fetch("/pingauth");
        if (a.status != 200) {
            navigate("/pagel")
        } else {
            const b = await a.json()
            setCurrentUser(b.currentUser)
        }


    }



    async function getfollowers() {
        const a = await fetch(`/followers?username=${username}`)

        if (a.status == 200) {
            const b = await a.json()
            console.log(b)
            setFollowers(b.followers)
        }
    }

    async function renderfollowers() {
        let newfollowersrender = []



        followers.forEach((follower) => {
            newfollowersrender.push([<li key={crypto.randomUUID()}><p>{follower.user}</p><button onClick={() => {
                if (follower.user == currentUser.userName) {
                    navigate("/mypage")
                } else {
                    navigate(`/userpage/${follower.user}`)
                }
               
            }}>Go to page</button></li>])
        })

        if (newfollowersrender.length > 0) {
            setFollowersRender(newfollowersrender)
        } else {
            setFollowersRender([<h3 key={crypto.randomUUID()}>No Followers</h3>])
        }


       

    }


    return <div id="followersfollowingscontainer"><h1>Followers</h1><ul>{followersRender}</ul><button onClick={() => { navigate(-1) }}>Back</button></div>
}





export default Followers