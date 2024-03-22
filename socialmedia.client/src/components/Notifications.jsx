import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react";



function Notifications() {
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([])
    let notificationrender = []


    useEffect(() => {
        getnotifications()
    }, [])
    rendernotifications()


    async function getnotifications() {
        const a = await fetch("/notifications")

        if (a.status == 200) {
           const b = await a.json();
                setNotifications(b.notifications)
               
            
           
        }
    }

    async function logout() {
        const a = await fetch("/logout")
        if (a.status == 200) {
            window.location.reload()
        }
    }

    function rendernotifications() {
     
        if (notifications.length > 0) {
            fetch("/notifications", {
                method: "DELETE"
            })
        }
        console.log(notifications)
        notifications.forEach((notification) => {
            notificationrender.push([<li key={crypto.randomUUID()} ><div className="notification" >{notification.message}</div><Link target="_blank" to={notification.link}><button>See Here</button></Link></li>])
        })
    }

    return <div id="homecontainer"><div id="leftnavbar"><button className="navbutton" onClick={() => { navigate("/") }}>Home</button><button className="navbutton currentpage" onClick={() => { navigate("/notifpage") }}>Notifications</button><button className="navbutton" onClick={() => { navigate("/search") }}>Search</button><button className="navbutton" onClick={() => {navigate("/inbox")}}>Messages</button><button className="navbutton" onClick={() => { navigate("/mypage") }}>Profile</button><button className="navbutton" onClick={() => { logout() }}>Log Out</button><button id="newpostbutton" onClick={() => { navigate("newpost") }}>New Post</button></div><div id="createpostbutton"></div><div id="pagecontent"><ul id="notificationlist">{notificationrender}</ul></div></div>
}



export default Notifications;