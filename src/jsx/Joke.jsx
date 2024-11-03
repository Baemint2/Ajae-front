import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import YellowStar from "../img/yellow_star.png";
import EmptyStar from "../img/empty_star.png";


const Joke = () => {
    const [joke, setJoke] = useState({question: '', answer: '', date: ''});
    const [showAnswer, setShowAnswer] = useState(false); // 정답 보기 상태 관리
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const today = new Date().toLocaleDateString();
        const savedJoke = JSON.parse(localStorage.getItem("dailyJoke"));

        if(!savedJoke || savedJoke.date !== today) {
            fetchJoke();
        } else {
            setJoke(savedJoke);
        }

        checkBookmark(savedJoke);
    }, []);

    const fetchJoke = () => {
        fetch("/api/v1/joke")
            .then(response => response.json())
            .then(data => {
                const today = new Date().toLocaleDateString();
                const newJoke = { question: data.question, answer: data.answer, date: today };
                setJoke(newJoke);
                localStorage.setItem("dailyJoke", JSON.stringify(newJoke));
            });
    };

    const checkBookmark = (jokeData) => {
        fetch("/api/v1/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jokeData)
        })
            .then(response => response.json())
            .then(data => setIsBookmarked(data));
    };

    const handleBookmark = () => {
        fetch("/api/v1/bookmark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(joke)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    setIsBookmarked(true);
                }
            });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold">오늘의 아재 개-그</h1>
            <div id="joke-container" className="border border-sky-400 rounded-3xl">
                <div className="mb-15">
                    <div className="question-wrap">
                        <span id="question">Q. {joke.question}</span>
                        {showAnswer && <span id="answer" className="mb-5" >A. {joke.answer}</span>}
                    </div>
                    {!showAnswer && (
                    <button 
                        type="button" 
                        id="openAnswer" 
                        className="openAnswer text-2xl w-40 h-10 bg-cyan-700 text-white mb-5" 
                        onClick={() => setShowAnswer(true)}
                    >
                        정답보기
                    </button>
                    )}
                    <div className="another-joke-wrap">
                        <Link to="/userJoke" className="text-cyan-400">다른 개그를 보러 가실래요?</Link>
                    </div>
                </div>
                <div className="bookmark-wrap border-t-2"> {isBookmarked ? (
                    <img className="yello_start" src={YellowStar} alt="노란별"></img>
                ) : (
                    <img className="empty_star" src={EmptyStar} alt="빈 별" onClick={handleBookmark}/>
                )}
                </div>
            </div>
        </div>
    );
};

export default Joke;
