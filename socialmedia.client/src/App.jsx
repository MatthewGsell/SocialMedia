import { useEffect, useState } from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import Home from "../src/components/Home"
import Messages from "../src/components/Messages"
import Message from "../src/components/Message"
import NewMessage from "../src/components/NewMessage"
import Mypage from "../src/components/MyPage"
import UserPage from "../src/components/UserPage"
import Login from "../src/components/Login"
import Signup from "../src/components/Signup"
import NewPost from './components/NewPost';
import Comments from "../src/components/Comments"
import Search from "./components/Search"
import Notifications from "./components/Notifications"

function App() {


    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/message" element={<Message />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/newpost" element={<NewPost />} />
                <Route path="/search" element={<Search />} />
                <Route path="/userpage"><Route path=":username" element={<UserPage />} /></Route>
                <Route path="/post"><Route path=":id" element={<Comments />} /></Route>
                <Route path="/notifpage" element={<Notifications />} />
                <Route path="/inbox" element={<Messages />} />
                <Route path="dm"><Route path=":id" element={<Message />} /></Route>
                <Route path="/newdm" element={<NewMessage />} /> 
            </Routes>
        </Router>
    );
}

export default App; 