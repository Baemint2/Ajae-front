import React, {useEffect, useMemo, useState} from "react";
import ChatRoomItem from "./ChatRoomItem";
import { ChatRoom, IChatRoomInfo } from "./interface/chatRoomTypes";
import {useStomp} from "./StompContext";
import {UserInfo} from "./interface/userTypes";

interface ChatRoomListProps {
    chatRooms: ChatRoom[],
    setChatRooms: React.Dispatch<React.SetStateAction<IChatRoomInfo[]>>
    subscribeToParticipants: (chatRoomId: number) => void,
    updateUnreadMessageCounts: () => void,
    currentChatRoomId: number | null;
    setCurrentChatRoomId: (chatRoomId: number | null) => void,
    isLoading: boolean
    userInfo?: UserInfo;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
                                                       chatRooms,
                                                       setChatRooms,
                                                       subscribeToParticipants,
                                                       updateUnreadMessageCounts,
                                                       currentChatRoomId,
                                                       setCurrentChatRoomId,
                                                       isLoading,
                                                       userInfo
                                                   }) => {

    const { stompClient } = useStomp();

    useEffect(() => {
        if (!stompClient || !stompClient.connected) return;


        let subscription = stompClient.subscribe("/sub/chat/update", (message) => {
            console.log(message);
            const updatedRoom = JSON.parse(message.body);
            setChatRooms((prevRooms) =>
                prevRooms.map((room) =>
                    room.chatRoomId === updatedRoom.chatRoomNo
                        ? { ...room, latelyMessage: updatedRoom.msgContent }
                        : room
                )
            );

            if (currentChatRoomId !== updatedRoom.chatRoomNo) {
                stompClient.publish({
                    destination: "/pub/unread",
                    body: JSON.stringify({ userId: userInfo?.id }),
                });
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [stompClient, stompClient?.connected]);



    const renderedChatRooms = useMemo(() => (
        chatRooms?.map((room) => (
            <ChatRoomItem
                key={room.chatRoomId}
                chatRoom={room}
                currentChatRoomId={currentChatRoomId}
                setCurrentChatRoomId={setCurrentChatRoomId}
                subscribeToParticipants={subscribeToParticipants}
                updateUnreadMessageCounts={updateUnreadMessageCounts}
                userInfo={userInfo}
            />
        ))
    ), [chatRooms, currentChatRoomId]);

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
