import React, {useEffect, useMemo, useState} from "react";
import ChatRoomItem from "./ChatRoomItem";
import { UserInfo } from "./interface/userTypes";

interface ChatRoom {
    chatRoomId: number;
    chatRoomTitle?: string;
    msgContent?: string;
    participantUsers: UserInfo[];
}

interface ChatRoomListProps {
    chatRooms: ChatRoom[],
    loadMessages: (chatRoomId: number) => void,
    subscribeToParticipants: (chatRoomId: number) => void,
    updateUnreadMessageCounts: () => void,
    currentChatRoomId: number | null;
    setCurrentChatRoomId: (chatRoomId: number | null) => void,
    isLoading: boolean
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
                                                       chatRooms,
                                                       loadMessages,
                                                       subscribeToParticipants,
                                                       updateUnreadMessageCounts,
                                                       currentChatRoomId,
                                                       setCurrentChatRoomId,
                                                       isLoading
                                                   }) => {

    useEffect(() => {
        console.log(chatRooms)
        console.log(isLoading)
    }, [chatRooms]);

    const renderedChatRooms = useMemo(() => (
        chatRooms?.map((room) => (
            <ChatRoomItem
                key={room.chatRoomId}
                chatRoom={room}
                currentChatRoomId={currentChatRoomId}
                setCurrentChatRoomId={setCurrentChatRoomId}
                loadMessages={loadMessages}
                subscribeToParticipants={subscribeToParticipants}
                updateUnreadMessageCounts={updateUnreadMessageCounts}
            />
        ))
    ), [chatRooms, currentChatRoomId]); // ✅ chatRooms나 currentChatRoomId가 변경될 때만 재렌더링

    return (
        <div>
            {/* ✅ 로딩 중일 때 표시할 UI */}
            {isLoading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>채팅방 목록을 불러오는 중...</p>
                </div>
            ) : (
                chatRooms.length > 0 ? renderedChatRooms : <p>참여 중인 채팅방이 없습니다.</p>
            )}
        </div>
    );
};

export default ChatRoomList;
