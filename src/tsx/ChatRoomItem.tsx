import React, {useEffect, useState} from "react";
import {UserInfo} from "./interface/userTypes";
import Anonymous from "../img/anonymous.png"

interface ChatRoomProps {
    chatRoom: {
        chatRoomId: number;
        chatRoomTitle?: string;
        msgContent?: string;
        participantUsers: UserInfo[];
    };
    currentChatRoomId: number | null;
    setCurrentChatRoomId: (chatRoomId: number | null) => void;
    loadMessages: (chatRoomId: number) => void;
    subscribeToParticipants: (chatRoomId: number) => void;
    updateUnreadMessageCounts: () => void;
}

const ChatRoomItem: React.FC<ChatRoomProps> = ({
                                                   chatRoom,
                                                   currentChatRoomId,
                                                   setCurrentChatRoomId,
                                                   loadMessages,
                                                   subscribeToParticipants,
                                                   updateUnreadMessageCounts,
                                               }) => {
    const handleClick = () => {
        if (currentChatRoomId === chatRoom.chatRoomId) {
            setCurrentChatRoomId(null);
        } else {
            setCurrentChatRoomId(chatRoom.chatRoomId);
            loadMessages(chatRoom.chatRoomId);
            subscribeToParticipants(chatRoom.chatRoomId);
            updateUnreadMessageCounts();
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
                    {chatRoom.msgContent ? chatRoom.msgContent.replace(/\n/g, "<br>") : "첫 메시지를 보내보세요!"}
                </div>
            </div>

            {/* 안 읽은 메시지 카운트 */}
            <div className="unread-count-badge"></div>
        </div>
    );
};

export default ChatRoomItem;
