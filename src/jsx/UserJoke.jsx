import React, {useState,  useEffect} from 'react';
import { useNavigate } from "react-router-dom";

import "../css/userJoke.css";

const UserJoke = () => {
    const navigate = useNavigate();

    const [userJoke, setUserJoke] = useState([]);

    useEffect(() => {
        getAllUserJoke();
    }, []);

    const getAllUserJoke = () => {
        fetch("/api/v1/allUserJoke")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUserJoke(data);
            })
    }

    const jokeClick = (jokeId, userId) => {
       navigate(`/userJoke/${jokeId}`);
       localStorage.setItem("userId", JSON.stringify(userId));
    }

    return (
        <div className="another-joke">
            <h1 className="text-3xl font-bold">유저들의 개-그</h1>
            {userJoke.map((item, index) => (
            <div className="border border-sky-400 rounded-3xl mb-10"  key={index}
                 onClick={() => jokeClick(item.joke.jokeId, item.user.id)}>
                <div className="user-wrap">
                    <img src={item.user.profile} alt="유저 프로필 사진" className="mx-5 my-5"></img>
                    <span>{item.user.nickname}</span>
                </div>
                <div className="question-wrap">
                    <span className="question">{item.joke.question}</span>
                </div>
                <div className="temp">
                    조회수 좋아요
                </div>
            </div>
            ))}
        </div>
    )
}

export default UserJoke;