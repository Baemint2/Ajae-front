import React, {useEffect, useState} from "react";
import { useUser } from './UserContext';
import "../css/myPage.css"

const MyPage = () => {
    const {user} = useUser();
    const [activeTab, setActiveTab] = useState("bookmarks");
    const [bookmark, setBookmark] = useState([]);
    const [joke, setJoke] = useState([]);
    const [jokeCount, setJokeCount] = useState(0);
    const [isEmpty, setIsEmpty] = useState({});

    useEffect(() => {
        if (user) {
            loadTabData(activeTab);
            userJokeCount();
        }
    }, [user, activeTab]);

    const loadTabData = async (tab) => {
        if (tab === "bookmarks") {
            await getAllJoke();
        } else {
            await fetchUserJokes();
        }
    };

    const getAllJoke = async () => {
        try {
            const response = await fetch("/api/v1/allJoke");
            if (!response.ok) {
                const data = await response.json();
                setBookmark([])
                setIsEmpty(data);
                return;
            }
            const data = await response.json();
            setBookmark(data);

        } catch (error) {
            console.error(error.message);
            setBookmark([]);
        }
    };

    const fetchUserJokes = async () => {
        const response = await fetch("/api/v1/userJoke");
        const data = await response.json();
        console.log(data);
        setJoke(data);
    }

    const userJokeCount = async () => {
        const response = await fetch("/api/v1/userJoke/count");
        const data = await response.json();
        console.log(data);
        setJokeCount(data);
    }

    const deleteBookmark = async (id) => {
        const body = {jokeId: id};
        const response = await fetch("/api/v1/bookmark" , {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (data.message === "북마크가 제거되었습니다.") {
            alert(data.message);
            getAllJoke();
        };
    }

    const toggleTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="my-page">
            <div className="top-layout border-2 border-amber-900 mb-5">
                <div className="profile-wrap">
                    {user ? (
                        <>
                            <img src={user.profile} alt="유저 프로필"></img>
                            <span>{user.nickname}</span>
                        </>
                    ) : (
                        <span></span>
                    )}
                </div>
                <div className="active-tap border-t">
                    <div>
                        <span>test</span>
                        <span className={`mr-5 ${activeTab === "bookmarks" ? "active" : ""}`}
                              onClick={() => toggleTab("bookmarks")}>내 북마크</span>
                    </div>
                    <div>
                        <span>{jokeCount}</span>
                        <span className={`${activeTab === "added-jokes" ? "active" : ""}`}
                              onClick={() => toggleTab("added-jokes")}>추가한 개그</span>
                    </div>
                </div>
            </div>
            <div className="bottom-layout">
                {activeTab === "bookmarks" && (
                    <JokeList jokes={bookmark} isEmptyMessage={isEmpty.message} deleteBookmark={deleteBookmark}/>
                )}
                {activeTab === "added-jokes" && (
                    <JokeList jokes={joke} isEmptyMessage="유저 개그가 없습니다." deleteBookmark={deleteBookmark}/>
                )}
            </div>
        </div>
    )
};

const JokeList = ({ jokes, isEmptyMessage, deleteBookmark }) => (
    <div className="my-bookmark">
        {jokes.length === 0 ? (
            <span>{isEmptyMessage}</span>
        ) : (
            jokes.map((item, index) => (
                <div className="border border-sky-400 rounded-3xl mb-10" key={index}>
                    <span className="delete-btn" onClick={() => deleteBookmark(item.jokeId)}>❌</span>
                    <div className="joke-wrap">
                        <span>{item.question}</span>
                        <span>{item.answer}</span>
                    </div>
                </div>
            ))
        )}
    </div>
);

export default MyPage;