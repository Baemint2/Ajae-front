import React, {useEffect, useState} from "react";
import { useUser } from './UserContext';
import {useNavigate} from "react-router-dom";
import "../css/myPage.css"


interface JokeListProps {
    jokes: any[];
    isEmptyMessage: string;
    deleteBookmark?: (id: number) => void;
    bookmarks: boolean;
}

interface emptyMessage {
    message?: string;
}

const MyPage = () => {
    const {user} = useUser();
    const [activeTab, setActiveTab] = useState<String>("bookmarks");
    const [bookmark, setBookmark] = useState([]);
    const [joke, setJoke] = useState([]);
    const [jokeCount, setJokeCount] = useState(0);
    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [isEmpty, setIsEmpty] = useState<emptyMessage>();

    useEffect(() => {
        // 세션에서 저장된 탭 상태 복원
        const storedTab = sessionStorage.getItem("activeTab");
        if (storedTab) {
            setActiveTab(storedTab);
        }
    }, []);

    const toggleTab = (tab: string) => {
        setActiveTab(tab);
        sessionStorage.setItem("activeTab", tab);  // 세션에 탭 상태 저장
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadTabData = async (tab?: string) => {
        if (activeTab === "bookmarks") {
            await getAllJoke();
        } else {
            await fetchUserJokes();
        }
    };

    useEffect(() => {
        loadTabData();
        userJokeCount();
        getBookmarkCount();
    }, [activeTab, loadTabData]);

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

        } catch (error: any) {
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

    const getBookmarkCount = async () => {
        const response = await fetch("/api/v1/bookmark/count");
        const data = await response.json();
        console.log(data);
        setBookmarkCount(data);
    }

    const deleteBookmark = async (id: number) => {
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
                        <span>{bookmarkCount}</span>
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
                    <JokeList jokes={bookmark} isEmptyMessage={isEmpty?.message || "등록된 북마크가 없습니다."} deleteBookmark={deleteBookmark} bookmarks={true}/>
                )}
                {activeTab === "added-jokes" && (
                    <JokeList jokes={joke} isEmptyMessage="유저 개그가 없습니다." bookmarks={false} />
                )}
            </div>
        </div>
    )
};

const JokeList: React.FC<JokeListProps> = ({ jokes, isEmptyMessage, deleteBookmark, bookmarks }) => {
    const navigate = useNavigate();

    return (
    <div className="my-bookmark">
        {jokes.length === 0 ? (
            <span>{isEmptyMessage}</span>
        ) : (
            jokes.map((item, index) => (
                <div className="border border-sky-400 rounded-3xl mb-10" key={index}>
                    {bookmarks && (
                        <span className="delete-btn" onClick={() => deleteBookmark ? deleteBookmark(item.jokeId) : null}>❌</span>
                    )}
                    <div className="joke-wrap">
                        {!bookmarks ? (
                            <>
                                <span onClick={() => navigate(`/userJoke/${item.jokeId}`)}>{item.question}</span>
                                <span>{item.answer}</span>
                            </>
                        ) : (
                            <>
                                <span>{item.question}</span>
                                <span>{item.answer}</span>
                            </>
                        )}
                    </div>
                </div>
            ))
        )}
    </div>
    )};

export default MyPage;