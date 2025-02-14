import React, { useEffect } from "react";
import {ChatRoom} from "./interface/chatRoomTypes";
import Anonymous from "../img/anonymous.png"
import {UserInfo} from "./interface/userTypes";
import {useBeforeUnload} from "react-router-dom";

interface ChatRoomProps {
    chatRoom: ChatRoom;
    currentChatRoomId: number | null;
    setCurrentChatRoomId: (chatRoomId: number | null) => void;
    userInfo?: UserInfo;
}

const ChatRoomItem: React.FC<ChatRoomProps> = ({
                                                   chatRoom,
                                                   currentChatRoomId,
                                                   setCurrentChatRoomId,
                                                   userInfo
                                               }) => {

    const handleClick = () => {
        if (currentChatRoomId === chatRoom.chatRoomId) {
            console.log(currentChatRoomId, userInfo?.id)
            updateLastSeenDt()
            setCurrentChatRoomId(null);
        } else {
            if (currentChatRoomId !== null) {
                updateLastSeenDt()
            }
            chatRoom.unreadCount = 0;
            setCurrentChatRoomId(chatRoom.chatRoomId);
        }
    };

    useBeforeUnload((event) => {
        updateLastSeenDt();
    })

    useEffect(() => {
        if (currentChatRoomId !== null) {
            console.log("반갑읍니다")
            console.log(chatRoom)
        }

    }, [currentChatRoomId]);

    const join = () => {
        return chatRoom.participantUsers.map(user => user.nickname).join(", ");
    }

    const updateLastSeenDt = () => {
        const body = {
            chatRoomId: currentChatRoomId,
            userId: userInfo?.id
        }
        fetch('http://localhost:8090/chatRoom/last-seen-update', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => {
            return response
        })
    }

    return (
        <div
            className={`msg-room ${currentChatRoomId === chatRoom.chatRoomId ? "active" : ""}`}
            data-chat-id={chatRoom.chatRoomId}
            onClick={handleClick}
        >
            {/* 프로필 이미지 */}
            <div className="profile-image">
                <div>
                    <img src={Anonymous} alt="Profile" />
                </div>
            </div>

            {/* 채팅방 정보 */}
            <div className="side-chat-room">
                <div>{chatRoom.chatRoomTitle ? chatRoom.chatRoomTitle : join()}</div>
                <div className="latest-message">
                    {chatRoom.latelyMessage ? chatRoom.latelyMessage.replace(/\n/g, "<br>") : "첫 메시지를 보내보세요!"}
                </div>
            </div>

            {/* 안 읽은 메시지 카운트 */}
            <div className="unread-count-badge"
                 style={{display: chatRoom.unreadCount === 0 || chatRoom.unreadCount === null ? "none" : "flex"}}
            >{chatRoom.unreadCount}</div>
        </div>
    );
};

export default ChatRoomItem;
