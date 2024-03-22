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
import Mypage from "../src/components/MyPage"
import UserPage from "../src/components/UserPage"
import Login from "../src/components/Login"
import Signup from "../src/components/Signup"
import NewPost from './components/NewPost';
import Comments from "../src/components/Comments"
import Search from "./components/Search"
import NewMessageSearch from "./components/NewMessageSearch"
import Notifications from "./components/Notifications"
import Followers from "../src/components/Followers"
import Following from "../src/components/Following"

function App() {


    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/message" element={<Message />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/pagel" element={<Login />} />
                <Route path="/pages" element={<Signup />} />
                <Route path="/newpost" element={<NewPost />} />
                <Route path="/search" element={<Search />} />
                <Route path="/newmessagesearch" element={<NewMessageSearch />} />
                <Route path="/userpage"><Route path=":username" element={<UserPage />} /></Route>
                <Route path="/post"><Route path=":id" element={<Comments />} /></Route>
                <Route path="/notifpage" element={<Notifications />} />
                <Route path="/inbox" element={<Messages />} />
                <Route path="/dm"><Route path=":username" element={<Message />} /></Route>
                <Route path="/flr"><Route path=":username" element={<Followers />} /></Route>
                <Route path="/flg"><Route path=":username" element={<Following />} /></Route>
            </Routes>
        </Router>
    );
}

export default App; 