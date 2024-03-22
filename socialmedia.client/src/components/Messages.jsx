import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from "@microsoft/signalr";

function Messages() {
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState()
    const [messages, setMessages] = useState([])
    const [render, setRender] = useState(0)
    const [unreadMessages, setUnreadMessages] = useState([])
    const [messagesRender, setMessagesRender] = useState([<h1 key={crypto.randomUUID()}>Loading...</h1>])
    const [signalRConnection, setSignalRConnection] = useState()

    if (signalRConnection) {
        signalRConnection.on("ReRender", () => {
            const newrender = render + 1
            setRender(newrender)
        })
    }

    useEffect(() => {
        isauthorized()
        getmessages()
    }, [render])

    useEffect(() => {
        joinhub();
    }, [currentUser])


    useEffect(() => {
        rendermessages()
   
    }, [currentUser, messages, unreadMessages])


    if (signalRConnection) {
        signalRConnection.on("ReRender", () => {
            const newrender = render + 1
            setRender(newrender)
        })
    }

    async function getmessages() {
        const a = await fetch("/messages")

        if (a.status == 200) {

            const b = await a.json()
            console.log(b)
            setMessages(b.messages)
            setUnreadMessages(b.unreadMessages)
        }
    }

    async function rendermessages() {
        const newmessagerender = []
        if (currentUser) {
            console.log(messages)
            messages.forEach((message) => {

                if (!unreadMessages.includes(message) && message != currentUser.userName) {
                    newmessagerender.push([<li key={crypto.randomUUID()} ><p>{message}</p><button onClick={() => {
                        navigate(`/dm/${message}`)
                    }}>Open</button></li>])
                }


            })

            unreadMessages.forEach((message) => {
                if (message != currentUser.userName) {
newmessagerender.push([<li key={crypto.randomUUID()} className="unread" ><p>{message}</p><p>New Message!</p><button onClick={() => {
                    navigate(`/dm/${message}`)
                }}>Open</button></li>])
                }
                

            })




            newmessagerender.reverse();

            if (newmessagerender.length > 0) {
                setMessagesRender(newmessagerender);
            } else {
                setMessagesRender([<h1 key={crypto.randomUUID()}>No Messages Yet</h1>])
            }

        }
       
     
    }






    async function joinhub() {
        if (currentUser) {


            const newsignalRConnection = new HubConnectionBuilder().withUrl("/chat", {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            }).withAutomaticReconnect().configureLogging(LogLevel.Information).build();


            try {
                await newsignalRConnection.start();
                await newsignalRConnection.invoke("JoinUserRoom", currentUser.userName)
                setSignalRConnection(newsignalRConnection);
            } catch (err) {
                console.error(err + "this error");
            }
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

    async function logout() {
        const a = await fetch("/logout")
        if (a.status == 200) {
            window.location.reload()
        }
    }







    return <div id="homecontainer"><div id="leftnavbar"><button className="navbutton" onClick={() => { navigate("/") }}>Home</button><button className="navbutton" onClick={() => { navigate("/notifpage") }}>Notifications</button><button className="navbutton" onClick={() => { navigate("/search") }}>Search</button><button className="navbutton currentpage">Messages</button><button className="navbutton" onClick={() => { navigate("/mypage") }}>Profile</button><button className="navbutton" onClick={() => { logout() }}>Log Out</button><button id="newpostbutton" onClick={() => { navigate("newpost") }}>New Post</button></div><div id="createpostbutton"></div><div id="pagecontent"><ul id="messagelist">{messagesRender}</ul><button onClick={() => navigate("/newmessagesearch")} id="newmessagebutton">New Message</button></div></div>
}

export default Messages