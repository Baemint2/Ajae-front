import "../css/chat.css"
import write from "../img/write.png"
import messageImg from "../img/message.png"
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import ChatRoomList from "./ChatRoomList";
import {useUser} from "./UserContext";
import { UserInfo } from "./interface/userTypes";
import CreateChatRoomModal from "./CreateChatRoomModal";
import MidChat from "./MidChat";
import {useStomp} from "./StompContext";


interface IChatRoomInfo {
    chatRoomId: number;
    chatRoomTitle?: string;
    createdAt: string;
    creator: string;
    participantUsers: UserInfo[]
    updatedAt?: string
    unreadCount?: number
}

const Chat = () => {
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [chatRooms, setChatRooms] = useState<IChatRoomInfo[]>([]);
    const [chatRoomInfo, setChatRoomInfo] = useState<IChatRoomInfo>();
    const {setUser} = useUser();
    const [currentChatRoomId, setCurrentChatRoomId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { stompClient, isConnected } = useStomp();

    useEffect(() => {
        setIsLoading(true)
        getUserInfo();
    }, []);

    useEffect(() => {
        if (!stompClient || !isConnected) return;

        getUnreadMessage();
        let subscription = stompClient.subscribe("/user/queue/unreadCount", (message) => {
            const updatedRoom = JSON.parse(message.body);
            console.log(updatedRoom)
            console.log(chatRooms)
            setChatRooms((prevRooms) =>
                prevRooms.map((room) =>
                    room.chatRoomId === updatedRoom.chatRoomNo
                        ? { ...room, unreadCount: updatedRoom.unreadCount }
                        : room
                )
            )
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [stompClient, userInfo, setChatRooms]);

    useEffect(() => {
        if (currentChatRoomId) {
            const selectedRoom = chatRooms?.find((room) => room.chatRoomId === currentChatRoomId);
            setChatRoomInfo(selectedRoom);
        }
    }, [currentChatRoomId, chatRooms]);

    useEffect(() => {

    }, [stompClient, isConnected]);

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    }

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    }

    const getUserInfo = () => {
        const getCookie = (name: String) => {
            const cookies = document.cookie.split("; ");
            for (let cookie of cookies) {
                const [key, value] = cookie.split("=");
                if (key === name) return value;
            }
            return null;
        };
        try {
            fetch(`http://localhost:8090/userInfo/${getCookie("username")}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
               return response.json();
            }).then((data: any) => {
                setUser(data);
                console.log(data);
                setUserInfo(data.second); // 사용자 정보 설정
                return getChatRoom(data.second.username);
            })
        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
        } finally {

            setTimeout(() => {
                setIsLoading(false)
            }, 100)

        }
    };

    const getChatRoom = async (username: String) => {
        const response = await fetch(`http://localhost:8090/chatRoom/${username}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setChatRooms(data.chatRoom);
    };


    const getUnreadMessage = () => {
        if (stompClient?.connected) {

            stompClient.publish({
                destination: "/pub/unread",
                body: JSON.stringify({ userId: userInfo?.id }),
            });
        } else {
            console.error("연결 안됨");
        }
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
                                                                setChatRooms={setChatRooms}
                                                                currentChatRoomId={currentChatRoomId}
                                                                subscribeToParticipants={subscribeToParticipants}
                                                                updateUnreadMessageCounts={updateUnreadMessageCounts}
                                                                setCurrentChatRoomId={setCurrentChatRoomId}
                                                                isLoading={isLoading}
                                                                userInfo={userInfo}
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

                                            <CreateChatRoomModal isOpen={isCreateModalOpen}
                                                                 isClose={closeCreateModal}
                                                                 modalTitle="채팅방 생성"
                                                                 userInfo={userInfo!}/>


                                            <MidChat currentChatRoomId={currentChatRoomId}
                                                     setChatRooms={setChatRooms}
                                                     chatRoomInfo={chatRoomInfo}
                                                     userInfo={userInfo!}
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