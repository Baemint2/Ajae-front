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
import { UserInfo } from "./interface/userTypes";
import CreateChatRoomModal from "./CreateChatRoomModal";
import MidChat from "./MidChat";

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

interface IChatRoomInfo {
    chatRoomId: number;
    chatRoomTitle?: string;
    createdAt: string;
    creator: string;
    participantUsers: UserInfo[]
    updatedAt?: string
}

const Chat = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [chatRooms, setChatRooms] = useState<IChatRoomInfo[]>([]);
    const [chatRoomInfo, setChatRoomInfo] = useState<IChatRoomInfo>();
    const {setUser} = useUser();
    const [currentChatRoomId, setCurrentChatRoomId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        if (userInfo?.username) {
            getChatRoom();
        }
    }, [userInfo]);

    useEffect(() => {
        if (currentChatRoomId) {
            const selectedRoom = chatRooms.find((room) => room.chatRoomId === currentChatRoomId);
            setChatRoomInfo(selectedRoom);
        }
    }, [currentChatRoomId, chatRooms]);


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

    const getChatRoom = async () => {
        const response = await fetch(`http://localhost:8090/chatRoom/${userInfo?.username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        setChatRooms(data.chatRoom);
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


                                            <MidChat currentChatRoomId={currentChatRoomId}
                                                     chatRoomInfo={chatRoomInfo}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

        </div>
    )
}

export default Chat;