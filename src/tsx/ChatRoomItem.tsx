import React, {useEffect, useState} from "react";
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
            // TODO lastSeenDt 호출
            setCurrentChatRoomId(null);
        } else {
            console.log(currentChatRoomId)
            // TODO lastSeenDt 호출
            setCurrentChatRoomId(chatRoom.chatRoomId);
        }
    };

    useBeforeUnload((event) => {
        console.log("새로고침을 하거나 종료를 합니다.")
        console.log(currentChatRoomId, userInfo?.id)
        // TODO lastSeenDt 호출
        event.preventDefault()
    })

    useEffect(() => {
        console.log(chatRoom)
    }, [chatRoom]);

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
                 style={{display: chatRoom.unreadCount === 0 || chatRoom.unreadCount === null ? "none" : "flex"}}
            >{chatRoom.unreadCount}</div>
        </div>
    );
};

export default ChatRoomItem;
