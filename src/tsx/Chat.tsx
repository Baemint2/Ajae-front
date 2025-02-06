import "../css/chat.css"
import write from "../img/write.png"
import anonymous from "../img/anonymous.png"
import menu from "../img/menu.png"
import messageImg from "../img/message.png"
import question from "../img/question.png"
import React, {useEffect, useRef, useState} from "react";
import sockJS from "sockjs-client"
import { Client } from "@stomp/stompjs";
import MessageItem from "./MessageItem";
import ChatRoomList from "./ChatRoomList";
import {useUser} from "./UserContext";
import CreateChatRoomModal from "./CreateChatRoomModal";

interface Message {
    msgId: number;
    userId: number;
    nickname: string;
    empProfile?: string;
    msgContent: string;
    msgDt: string;
    msgStat: number | "DELETED";
    chatRoomNo: number;
}

interface IUserInfo {
    profile?: string;
    username: string;
    email: string;
    nickname?: string;
}

interface IChatRoomInfo {
    chatRoomId: number;
    chatRoomTitle?: string;
    createdAt: string;
    creator: string;
    participantUsers: string
    updatedAt?: string
}

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const rightSidebarRef = useRef<HTMLDivElement>(null);
    const midChatRef = useRef<HTMLDivElement>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
    const [chatRooms, setChatRooms] = useState<IChatRoomInfo[]>([]);
    const {setUser} = useUser();
    const [currentChatRoomId, setCurrentChatRoomId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);


    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        console.log('56')
        console.log(userInfo?.username)
        if (userInfo?.username) {
            getChatRoom();
        }
    }, [userInfo]);

    useEffect(() => {
        console.log("Updated chatRooms state:", chatRooms);
    }, [chatRooms]);  // ✅ chatRooms가 변경될 때마다 실행


    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    }

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    }


    const getUserInfo = async () => {
        const getCookie = (name: String) => {
            const cookies = document.cookie.split("; ");
            for (let cookie of cookies) {
                const [key, value] = cookie.split("=");
                if (key === name) return value;
            }
            return null;
        };
        try {
            const response = await fetch(`http://localhost:8090/userInfo/${getCookie("username")}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("사용자 정보를 가져오지 못했습니다.");
            const data = await response.json();
            console.log(data)
            setUser(data);
            setUserInfo(data.second); // 사용자 정보 설정
        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
        }
    };

    const socket = new sockJS("http://localhost:8090/chat");

    const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
        console.log("STOMP Connected!");

        // // 구독 설정 (서버에서 메시지를 받을 경로)
        // stompClient.subscribe("/sub/chatroom", (message) => {
        //     console.log("서버로부터 메시지 수신: ", JSON.parse(message.body));
        // });
    };

    stompClient.activate();

    const sendMessage = () => {
        console.log("메시지 전송");
        if (stompClient.connected) {
            const newMsg = {
                msgId: Date.now(),
                userId: 1,
                nickname: "나",
                msgContent: message,
                msgDt: new Date().toISOString(),
                msgStat: 0,
                chatRoomNo: 123,
            };
            setMessages((prevMessages) => [...prevMessages, newMsg]); // ✅ 전송된 메시지도 추가
            stompClient.publish({
                destination: "/pub/chat/message", // Spring Boot에서 메시지 처리
                body: JSON.stringify(newMsg),
            });
            setMessage("");
        }
    };

    const getChatRoom = async () => {
        const response = await fetch(`http://localhost:8090/chatRoom/${userInfo?.username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(Array.isArray(data.chatRoom));
        setChatRooms(data.chatRoom);
    }


    const deleteMessage = () => {
        console.log("메시지 삭제")
    }

    const toggleSideBar = () => {
        console.log("사이드바 토글")

        if (!rightSidebarRef.current || !midChatRef.current) return; // ✅ null 체크

        if (rightSidebarRef.current.style.display === "none" || rightSidebarRef.current.style.display === "") {
            rightSidebarRef.current.style.display = "flex";
            midChatRef.current.style.flexGrow = "0";
        } else {
            rightSidebarRef.current.style.display = "none";
            midChatRef.current.style.flexGrow = "1";
        }
    }

    const loadMessages = (chatRoomNo: number) => {
        console.log("Loading messages for room:", chatRoomNo);
    };
    const subscribeToParticipants = (chatRoomNo: number) => {
        console.log("Subscribing to room:", chatRoomNo);
    };
    const updateUnreadMessageCounts = () => {
        console.log("Updating unread messages");
    };

    return (
        <div>
            <div className="crispy-container">
                <div>
                    <main>
                        <div>
                            <div className="container message">
                                <div className="main">
                                    <div>
                                        <div className="box">

                                            <div className="left">

                                                <div className="request">
                                                    <a role="button" className="send-message" data-bs-toggle="modal"
                                                       data-bs-target="#createChatRoomModal">
                                                        <img className="icon" src={write} alt="메시지 작성 아이콘"/>
                                                    </a>
                                                </div>

                                                <div>
                                                    <div>
                                                        <div className="msg-room-list" id="chatRoomList">
                                                            <ChatRoomList
                                                                chatRooms={chatRooms}
                                                                loadMessages={loadMessages}
                                                                currentChatRoomId={currentChatRoomId}
                                                                subscribeToParticipants={subscribeToParticipants}
                                                                updateUnreadMessageCounts={updateUnreadMessageCounts}
                                                                setCurrentChatRoomId={setCurrentChatRoomId}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mid-intro"
                                                 style={{display: currentChatRoomId ? "none" : "flex"}}>
                                                <div className="intro">
                                                    <div>
                                                        <div className="circle"></div>
                                                        <img src={messageImg} alt="메시지 아이콘"/>
                                                    </div>
                                                    <div>내 메시지</div>
                                                    <div>친구나 그룹에 사진과 메시지를 보내보세요.</div>
                                                        <button id="msg" onClick={openCreateModal} className="send-message">메시지 보내기</button>
                                                </div>
                                            </div>

                                            <CreateChatRoomModal isOpen={isCreateModalOpen} isClose={closeCreateModal}/>


                                            <div className="mid-chat" ref={midChatRef}
                                                 style={{display: currentChatRoomId ? "flex" : "none"}}>
                                                <div className="chat-name">
                                                    <div className="profile-image">
                                                        <div><img src={anonymous}/></div>
                                                    </div>
                                                    <div id="chatName">{userInfo?.nickname || '절대고집'}</div>
                                                    <div>검색</div>
                                                    <div>
                                                        <a role="button" id="toggleSidebar" onClick={toggleSideBar}><img
                                                            src={menu} alt={"menu"}/></a>
                                                    </div>
                                                </div>
                                                <div className="chat-window">
                                                    <div id="chatMessages">
                                                        {messages.map((msg) => (
                                                            <MessageItem key={msg.msgId} msg={msg} currentUserId={1}
                                                                         deleteMessage={deleteMessage}/>
                                                        ))}
                                                    </div>
                                                    <div className="input">
                                                        <div>
                                                            <form method="post">
                                                                <textarea name="chat" id="chatInput" rows={1}
                                                                          value={message}
                                                                          onChange={(e) => setMessage(e.target.value)}
                                                                          placeholder="메시지 입력..."></textarea>
                                                            </form>
                                                            <div><img className="icon" src={messageImg} alt="보내기 아이콘"
                                                                      onClick={sendMessage}/></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="right-intro" id="rightSidebar" ref={rightSidebarRef}>
                                                <div className="intro">
                                                    <div className="chat-side-bar">대화하는 유저 목록</div>
                                                    <div className="side-bar-img-wrap">
                                                        <div className="profile-image">
                                                            <a role="button" className="send-message"
                                                               data-modal-toggle="invite-modal"
                                                               data-modal-target="invite-modal">
                                                                <div><img src={question}/></div>
                                                                <span>새로운 사용자 초대</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <hr/>
                                                </div>
                                                <div className="chat-room-wrap">
                                                    <div className="intro">
                                                        <div>
                                                            <div className="notify-on">
                                                                <i className="fa-solid fa-bell"></i>
                                                                알림켜기
                                                            </div>
                                                            <div className="notify-off">
                                                                <i className="fa-solid fa-bell-slash"></i>
                                                                알림끄기
                                                            </div>
                                                            <div className="leave-chat-room" id="leave-room">
                                                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                                                나가기
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                <div id="invite-modal" tabIndex={-1} aria-hidden="true"
                                     className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                                        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                                            <div
                                                className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    사용자 초대
                                                </h3>
                                                <button type="button"
                                                        className="gtext-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                        data-modal-hide="invite-modal">
                                                    <svg className="w-3 h-3" aria-hidden="true"
                                                         xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 14 14">
                                                        <path stroke="currentColor" strokeLinecap={"round"}
                                                              strokeLinejoin={"round"} strokeWidth={"2"}
                                                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                                    </svg>
                                                    <span className="sr-only">Close modal</span>
                                                </button>
                                            </div>
                                            <div className="p-4 md:p-5 space-y-4">
                                                <form id="invite-form">
                                                    <div className="mb-3">
                                                        <label className="form-label">받는 사람</label>
                                                        <input type="text" className="form-control" id="recipient"
                                                               placeholder="사용자 이름 또는 ID 검색"/>
                                                        <div id="selectedUserLists"
                                                             className="selected-user-list"></div>
                                                    </div>
                                                    <div className="search-results">
                                                    </div>
                                                    <button type="submit">초대</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*<div className="modal fade" id="invite-modal" tabIndex={-1} aria-labelledby="invite-modal"*/}
                                {/*     aria-hidden="true">*/}
                                {/*    <div className="modal-dialog modal-dialog-centered">*/}
                                {/*        <div className="modal-content">*/}
                                {/*            <div className="modal-header">*/}
                                {/*                <h4 className="modal-title" id="invite-modal-label">사용자 초대</h4>*/}
                                {/*                <button type="button" className="btn" data-bs-dismiss="modal"*/}
                                {/*                        aria-label="Close">X</button>*/}
                                {/*            </div>*/}
                                {/*            <div className="modal-body">*/}

                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

        </div>
    )
}

export default Chat;