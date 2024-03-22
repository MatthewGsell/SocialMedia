import { useNavigate, Link, useParams } from "react-router-dom"
import { useState, useEffect, useRef } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from "@microsoft/signalr";

function Message() {
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState({})
    const [messages, setMessages] = useState([])
    const [render, setRender] = useState(0)
    const [messagesRender, setMessagesRender] = useState([<h1 key={crypto.randomUUID()}>Loading</h1>])

    const messagetext = useRef()
    const { username } = useParams();

    const [signalRConnection, setSignalRConnection] = useState()

    useEffect(() => {
        isauthorized()
        getmessages()
        
    }, [render])


    useEffect(() => {
        joinhub()
    }, [currentUser])

    useEffect(() => {
        rendermessages()
    }, [currentUser, messages])

    if (signalRConnection) {
        signalRConnection.on("ReRender", () => {
            const newrender = render + 1
            setRender(newrender)
        })
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


    async function deletemessage(e) {
        const a = await fetch(`/singlemessages?id=${e.target.parentElement.id}`, {
            method: 'DELETE',
      
        })
        if (a.status == 200) {
            const newrender = render + 1
            messagetext.current.value = ""
            setRender(newrender)

        } else {
            alert("there was a problem")
        }

    }
    async function sendmessage() {
        const a = await fetch("/singlemessages", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                SentFrom: currentUser.userName,
                SentTo: username,
                Content: messagetext.current.value,
                Read: false
            })
        })
        if (a.status == 200) {
            await signalRConnection.invoke("TriggerRender", username)
            const newrender = render + 1
            messagetext.current.value = ""
            setRender(newrender)
         
        } else {
            alert("there was a problem")
        }
    }


    async function getmessages() {
        const a = await fetch(`/singlemessages?otheruser=${username}`)

        if (a.status == 200) {

            const b = await a.json()
            setMessages(b.messages)
        }
    }

    async function rendermessages() {
        let newmessagerender = []

        messages.forEach((message) => {
            if (message.sentFrom == currentUser.userName) {
                newmessagerender.push([<li id={message.id} key={crypto.randomUUID()}><p>{message.content}</p><button onClick={deletemessage}>Delete</button></li>])
            } else {
                newmessagerender.push([<li id={message.id} key={crypto.randomUUID()}><p>{message.content}</p></li>])
            }
            

           

        })


        if (newmessagerender.length > 0) {
            setMessagesRender(newmessagerender);
        } else {
            setMessagesRender([<h1 key={crypto.randomUUID()}>No Messages Yet</h1>])
        }
         newmessagerender.reverse();
    }





    async function logout() {
        const a = await fetch("/logout")
        if (a.status == 200) {
            window.location.reload()
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







    return <div id="homecontainer"><div id="leftnavbar"><button className="navbutton" onClick={() => { navigate("/") }}>Home</button><button className="navbutton" onClick={() => { navigate("/notifpage") }}>Notifications</button><button className="navbutton" onClick={() => { navigate("/search") }}>Search</button><button className="navbutton currentpage" onClick={() => {navigate("/messages")} }>Messages</button><button className="navbutton" onClick={() => { navigate("/mypage") }}>Profile</button><button className="navbutton" onClick={() => { logout() }}>Log Out</button><button id="newpostbutton" onClick={() => { navigate("newpost") }}>New Post</button></div><div id="createpostbutton"></div><div id="pagecontent"><ul id="directmessagelist">{messagesRender}</ul><div id="sendmessagediv"><textarea id="newmessagetext" placeholder="enter message here limit 2000 characters" maxLength="2000" ref={messagetext}></textarea><button onClick={sendmessage}>Send Message</button><button onClick={() => { navigate(-1) }} id="messagebackbutton">Back</button></div></div></div>
}

export default Message