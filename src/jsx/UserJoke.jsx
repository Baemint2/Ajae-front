import React, {useState,  useEffect} from 'react';
import { useNavigate } from "react-router-dom";

import "../css/userJoke.css";
let pageNo = 0;
const UserJoke = () => {
    const navigate = useNavigate();

    const [userJoke, setUserJoke] = useState({ content: [] });

    useEffect(() => {
        let jokeWrap = document.querySelector(".joke-wrap");
        getAllUserJoke(pageNo);
        const handleScroll = () => {
            const scrollTop = jokeWrap.scrollTop; // 요소의 스크롤 위치
            const scrollHeight = jokeWrap.scrollHeight; // 요소의 전체 콘텐츠 높이
            const clientHeight = jokeWrap.clientHeight; // 화면에 보이는 부분의 높이

            if (scrollTop + clientHeight >= scrollHeight) {
                pageNo++
                getAllUserJoke(pageNo);
                console.log(pageNo);
                console.log("스크롤이 바닥에 닿았습니다.");
            }
        };

        jokeWrap.addEventListener("scroll", handleScroll);

        return () => {
            jokeWrap.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const getAllUserJoke = (pageNo) => {
        fetch(`/api/v1/allUserJoke?page=${pageNo}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(pageNo)
                setUserJoke((prevUserJoke) => ({
                    ...data,
                    content: [...prevUserJoke.content, ...data.content], // 기존 content에 새로운 content를 병합
                }));
            })
    }

    const jokeClick = (jokeId, userId) => {
       navigate(`/userJoke/${jokeId}`);
       localStorage.setItem("userId", JSON.stringify(userId));
    }

    return (
        <div className="user-joke">
            <h1 className="text-3xl font-bold">유저들의 개-그</h1>
            <div className="joke-wrap mt-5">
            {userJoke.content?.map((item, index) => (
            <div className="border border-sky-400 rounded-3xl my-8"  key={index}
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
        </div>
    )
}

export default UserJoke;