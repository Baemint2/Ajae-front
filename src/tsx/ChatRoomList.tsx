import React, {useState} from "react";
import ChatRoomItem from "./ChatRoomItem";

interface ChatRoom {
    chatRoomId: number;
    chatRoomTitle?: string;
    msgContent?: string;
}

interface ChatRoomListProps {
    chatRooms: ChatRoom[],
    loadMessages: (chatRoomId: number) => void,
    subscribeToParticipants: (chatRoomId: number) => void,
    updateUnreadMessageCounts: () => void,
    currentChatRoomId: number | null;
    setCurrentChatRoomId: (chatRoomId: number | null) => void,
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
                                                       chatRooms,
                                                       loadMessages,
                                                       subscribeToParticipants,
                                                       updateUnreadMessageCounts,
                                                       currentChatRoomId,
                                                       setCurrentChatRoomId,
                                                   }) => {



    return (
        <div>
            {chatRooms.length === 0 ? (
                <p>참여 중인 채팅방이 없습니다.</p>
            ) : (
                chatRooms.map((room) => (
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
            )}
        </div>
    );
};

export default ChatRoomList;
