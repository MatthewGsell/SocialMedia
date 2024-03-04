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
function App() {


    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/message" element={<Message />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/userpage" element={<UserPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/newpost" element={<NewPost />} />
            </Routes>
        </Router>
    );
}

export default App; 