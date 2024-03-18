import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from "@microsoft/signalr";

function Messages() {
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    let notificationrender = []


    useEffect(() => {
        isauthorized()
        test()
        
    }, [])
    rendermessages()

   



    async function test() {
        const signalRConnection = new HubConnectionBuilder().withUrl("/messages", {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        }).withAutomaticReconnect().configureLogging(LogLevel.Information).build();
        signalRConnection.on("receivemessage", (message) => {
            console.log("message")
        })
        
      
        const message = "HDHCDHJIBCBH"
        try {
           await signalRConnection.start();
            
            
            console.log('yo')
        } catch (err) {
            console.error(err + "this error");
        }
        signalRConnection.invoke("SendMessage", message)
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





    function rendermessages() {

        if (notifications.length > 0) {
            fetch("/notifications", {
                method: "DELETE"
            })
        }
       
        notifications.forEach((notification) => {
            notificationrender.push([<li key={crypto.randomUUID()} ><div className="notification" >{notification.message}</div><Link target="_blank" to={notification.link}><button>See Here</button></Link></li>])
        })
    }

    return <div id="homecontainer"><div id="leftnavbar"><button className="navbutton" onClick={() => { navigate("/") }}>Home</button><button className="navbutton" onClick={() => { navigate("/notifpage") }}>Notifications</button><button className="navbutton" onClick={() => { navigate("/search") }}>Search</button><button className="navbutton currentpage">Messages</button><button className="navbutton" onClick={() => { navigate("/mypage") }}>Profile</button><button className="navbutton" onClick={() => { logout() }}>Log Out</button><button id="newpostbutton" onClick={() => { navigate("newpost") }}>New Post</button></div><div id="createpostbutton"></div><div id="pagecontent"><ul id="notificationlist">{notificationrender}</ul></div></div>
}

export default Messages