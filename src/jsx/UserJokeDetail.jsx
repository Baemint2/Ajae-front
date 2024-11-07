import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/userJoke.css";
import {timeSetting} from "../timeUtils";


const UserJokeDetail = () => {

    const params = useParams();

    const [userJoke, setUserJoke] = useState({});
    const [showAnswer, setShowAnswer] = useState(false); // 정답 보기 상태 관리
    const pageNo = localStorage.getItem("pageNo");
    const navigate = useNavigate();

    useEffect(() => {
        getUserJokeDetail(params.id);
    },[params.id])

    const body = {
        jokeId: params.id,
        userId: localStorage.getItem("userId")
    }

    const getUserJokeDetail = () => {
        fetch(`/api/v1/userJoke`, {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(data => {
                setUserJoke(data);
            })
    }

    return (
        <div className="user-joke-detail">
            <div className="border border-sky-400 rounded-3xl mb-10">
                {userJoke.user ? (
                    <>
                        <div className="user-wrap">
                            <img alt="프로필 사진" src={userJoke.user.profile} className="mx-5 my-5"/>
                            <span>{userJoke.user.nickname}</span>
                            <span className="ml-4">{timeSetting(userJoke.joke.createdAt)}</span>
                        </div>
                        <div className="question-wrap">
                            <span className="question mb-4">Q. {userJoke.joke.question}</span>
                            {showAnswer && <span className="answer">A. {userJoke.joke.answer}</span>}
                            {!showAnswer && (
                                <button
                                    type="button"
                                    className="open-answer"
                                    onClick={() => setShowAnswer(true)}
                                >
                                    정답보기
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="user-wrap">
                            <img alt="기본 프로필 사진"/>
                            <span>닉네임 없음</span>
                        </div>
                    </>
                )}
            </div>
            <div onClick={() => navigate(`/userJoke?page=${pageNo}`)}>
                <span>목록으로</span>
            </div>
        </div>
    )
}

export default UserJokeDetail;