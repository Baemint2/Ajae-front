import React, {useEffect, useState} from "react";
import {UserInfo} from "./interface/userTypes";
import {ChatRoom} from "./interface/chatRoomTypes";
import Anonymous from "../img/anonymous.png"
import {useStomp} from "./StompContext";

interface ChatRoomProps {
    chatRoom: ChatRoom;
    currentChatRoomId: number | null;
    setCurrentChatRoomId: (chatRoomId: number | null) => void;
    subscribeToParticipants: (chatRoomId: number) => void;
    updateUnreadMessageCounts: () => void;
}

const ChatRoomItem: React.FC<ChatRoomProps> = ({
                                                   chatRoom,
                                                   currentChatRoomId,
                                                   setCurrentChatRoomId,
                                                   subscribeToParticipants,
                                                   updateUnreadMessageCounts,
                                               }) => {

    const { stompClient } = useStomp();

    const handleClick = () => {
        if (currentChatRoomId === chatRoom.chatRoomId) {
            setCurrentChatRoomId(null);
        } else {
            setCurrentChatRoomId(chatRoom.chatRoomId);
            subscribeToParticipants(chatRoom.chatRoomId);
            updateUnreadMessageCounts();

            if (stompClient && stompClient.connected) {
                console.log(stompClient)
                stompClient.publish({
                    destination: "/pub/chat/join",
                    body: JSON.stringify({ userId: 17 }), // 🔹 현재 유저 ID 넣기
                });
            }
        }
    };

    const join = () => {
        return chatRoom.participantUsers.map(user => user.nickname).join(", ");
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
                 style={{display: chatRoom.unreadCount === 0 ? "none" : "flex"}}
            >{chatRoom.unreadCount}</div>
        </div>
    );
};

export default ChatRoomItem;
