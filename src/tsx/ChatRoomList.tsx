import React, {useEffect, useMemo, useState} from "react";
import ChatRoomItem from "./ChatRoomItem";
import { ChatRoom, IChatRoomInfo } from "./interface/chatRoomTypes";
import {useStomp} from "./StompContext";

interface ChatRoomListProps {
    chatRooms: ChatRoom[],
    setChatRooms: React.Dispatch<React.SetStateAction<IChatRoomInfo[]>>
    subscribeToParticipants: (chatRoomId: number) => void,
    updateUnreadMessageCounts: () => void,
    currentChatRoomId: number | null;
    setCurrentChatRoomId: (chatRoomId: number | null) => void,
    isLoading: boolean
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
                                                       chatRooms,
                                                       setChatRooms,
                                                       subscribeToParticipants,
                                                       updateUnreadMessageCounts,
                                                       currentChatRoomId,
                                                       setCurrentChatRoomId,
                                                       isLoading
                                                   }) => {

    const { stompClient } = useStomp();

    useEffect(() => {
        if (stompClient && stompClient.connected) {
            // ✅ 최신 메시지 업데이트 구독
            stompClient.subscribe("/sub/chat/update", (message) => {
                const updatedRoom = JSON.parse(message.body);
                setChatRooms((prevRooms) =>
                    prevRooms.map((room) =>
                        room.chatRoomId === updatedRoom.chatRoomNo
                            ? { ...room, latelyMessage: updatedRoom.msgContent }
                            : room
                    )
                );
            });
        }
    }, [chatRooms, setChatRooms, stompClient]);


    const renderedChatRooms = useMemo(() => (
        chatRooms?.map((room) => (
            <ChatRoomItem
                key={room.chatRoomId}
                chatRoom={room}
                currentChatRoomId={currentChatRoomId}
                setCurrentChatRoomId={setCurrentChatRoomId}
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
