import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import "../css/userJoke.css";
import { timeSetting } from "../timeUtils";

interface User {
    id: number;
    nickname: string;
    profile: string;
}

interface Joke {
    jokeId: number;
    question: string;
    createdAt: string;
}

interface UserJokeData {
    content: {
        joke: Joke;
        user: User;
    }[];
}


const UserJoke = () => {
    const navigate = useNavigate();
    const [userJoke, setUserJoke] = useState<UserJokeData>({ content: [] });
    const [searchParams, setSearchParams] = useSearchParams();
    let pageNo = parseInt(searchParams.get("page") || "1") ; // URL 파라미터에서 1부터 시작
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getAllUserJoke(pageNo - 1); // API 호출 시에는 pageNo - 1
        if (!searchParams.has("page")) {
            setSearchParams({ page: "1" });
            pageNo = 1; // 추가된 후 페이지 번호를 1로 설정
        }
    }, [pageNo, searchParams, setSearchParams]); // pageNo 또는 searchParams 변경 시 호출

    const getAllUserJoke = (page: number) => {
        fetch(`/api/v1/allUserJoke?page=${page}`)
            .then(response => response.json())
            .then(data => {
                setUserJoke(data);
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = 0;
                }
            });
    }

    const jokeClick = (jokeId: number, userId: number) => {
        navigate(`/userJoke/${jokeId}`);
        localStorage.setItem("pageNo", JSON.stringify(pageNo));
        localStorage.setItem("userId", JSON.stringify(userId));
    }

    const handleNextPage = () => {
        setSearchParams({ page: (pageNo + 1).toString() }); // 다음 페이지를 1 증가시킴
    };

    const handlePreviousPage = () => {
        if (pageNo > 1) {
            setSearchParams({ page: (pageNo - 1).toString() }); // 이전 페이지를 1 감소시킴
        }
    };

    return (
        <div className="user-joke">
            <div className="title-wrap">
                <h1 className="text-3xl font-bold">유저들의 개-그</h1>
                <button className="bg-cyan-700" onClick={() => navigate("/AddJoke")}>개그 추가하기</button>
            </div>
            <div className="joke-wrap" ref={scrollContainerRef}>
                {userJoke.content?.map((item, index) => (
                    <div className="border border-sky-400 rounded-3xl my-8" key={index}
                         onClick={() => jokeClick(item.joke.jokeId, item.user.id)}>
                        <div className="user-wrap">
                            <img src={item.user.profile} alt="유저 프로필 사진" className="mx-5 my-5" />
                            <span>{item.user.nickname}</span>
                            <span className="ml-4">{timeSetting(item.joke.createdAt)}</span>
                        </div>
                        <div className="question-wrap">
                            <span className="question">{item.joke.question}</span>
                        </div>
                    </div>
                ))}
                <div className="page-btn">
                    <span onClick={handlePreviousPage}>previous</span>
                    <span onClick={handleNextPage}>next</span>
                </div>
            </div>
        </div>
    );
}

export default UserJoke;
