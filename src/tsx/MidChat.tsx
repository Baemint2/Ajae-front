import anonymous from "../img/anonymous.png";
import menu from "../img/menu.png";
import MessageItem from "./MessageItem";
import messageImg from "../img/message.png";
import React, {useEffect, useRef, useState} from "react";
import question from "../img/question.png";
import { UserInfo } from "./interface/userTypes";
import InviteModal from "./InviteModal";


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

interface MidChatProps {

    currentChatRoomId: number | null
    chatRoomInfo?: IChatRoomInfo
}

const MidChat: React.FC<MidChatProps> = ({currentChatRoomId, chatRoomInfo}) => {
    const rightSidebarRef = useRef<HTMLDivElement>(null);
    const midChatRef = useRef<HTMLDivElement>(null);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);


    useEffect(() => {
    }, [chatRoomInfo]);

    const deleteMessage = () => {
        console.log("메시지 삭제")
    }

    useEffect(() => {
        if(currentChatRoomId === null) {
            toggleSideBar()
        }

    }, [currentChatRoomId]);

    const toggleSideBar = () => {

        if (!rightSidebarRef.current || !midChatRef.current) return;

        if (rightSidebarRef.current.style.display === "none" || rightSidebarRef.current.style.display === "") {
            rightSidebarRef.current.style.display = "flex";
            midChatRef.current.style.flexGrow = "0";
        } else {
            rightSidebarRef.current.style.display = "none";
            midChatRef.current.style.flexGrow = "1";
        }

        if(currentChatRoomId === null) {
            rightSidebarRef.current.style.display = "none";
            midChatRef.current.style.flexGrow = "1";
        }
    }

    const sendMessage = () => {
        console.log("메시지 전송");
        // if (stompClient.connected) {
        //     const newMsg = {
        //         msgId: Date.now(),
        //         userId: 1,
        //         nickname: "나",
        //         msgContent: message,
        //         msgDt: new Date().toISOString(),
        //         msgStat: 0,
        //         chatRoomNo: 123,
        //     };
        //     setMessages((prevMessages) => [...prevMessages, newMsg]);
        // stompClient.publish({
        //     destination: "/pub/chat/message", // Spring Boot에서 메시지 처리
        //     body: JSON.stringify(newMsg),
        // });
        setMessage("");
    }

    const join = () => {
        return chatRoomInfo?.participantUsers.map(user => user.nickname).join(", ");
    }

    const openInviteModal = () => {
        setIsInviteModalOpen(true);
    }

    const closeInviteModal = () => {
        setIsInviteModalOpen(false);
    }
    
    return (
        <>
            <div className="mid-chat" ref={midChatRef}
                 style={{display: currentChatRoomId ? "flex" : "none"}}>
                <div className="chat-name">
                    <div className="profile-image">
                        <div><img src={anonymous}/></div>
                    </div>
                    <div id="chatName" className="w-56">{chatRoomInfo?.chatRoomTitle ? chatRoomInfo.chatRoomTitle : join() }</div>
                    <div>검색</div>
                    <div>
                        <a role="button" id="toggleSidebar" onClick={toggleSideBar}><img
                            src={menu} alt={"menu"}/></a>
                    </div>
                </div>
                <div className="chat-window">
                    <div id="chatMessages">
                        {messages.map((msg) => (
                            <MessageItem key={msg.msgId} msg={msg} currentUserId={1}
                                         deleteMessage={deleteMessage}/>
                        ))}
                    </div>
                    <div className="input">
                        <div>
                            <form method="post">
                            <textarea name="chat" id="chatInput" rows={1}
                                      value={message}
                                      onChange={(e) => setMessage(e.target.value)}
                                      placeholder="메시지 입력..."
                            ></textarea>
                            </form>
                            <div>
                                <img className="icon"
                                     src={messageImg}
                                     alt="보내기 아이콘"
                                     onClick={sendMessage}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right-intro" id="rightSidebar" ref={rightSidebarRef}>
                <div className="intro">
                    <div className="chat-side-bar">대화하는 유저 목록</div>
                    <div className="side-bar-img-wrap">
                        <div className="profile-image">
                            <button className="send-message"
                                    onClick={openInviteModal}>
                                <div><img src={question} alt="물음표"/></div>
                                <span >새로운 사용자 초대</span>
                            </button>
                        </div>
                    </div>
                    <InviteModal isOpen={isInviteModalOpen}
                                 isClose={closeInviteModal}
                                 modalTitle="사용자 초대"
                                 chatRoomInfo={chatRoomInfo}
                    />
                    <hr/>
                    <div className="w-full flex flex-col pl-5">
                        {(
                            chatRoomInfo?.participantUsers.map((user) => (
                                <div key={user.nickname} className="flex flex-row items-center mt-5">
                                    <img src={user.profile ? user.profile : anonymous} alt={'프로필'}
                                         className=""
                                    />
                                    <div className="ml-8 text-3xl">{user.nickname}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="chat-room-wrap">
                    <div className="intro">
                        <div>
                            <div className="notify-on">
                                <i className="fa-solid fa-bell"></i>
                                알림켜기
                            </div>
                            <div className="notify-off">
                                <i className="fa-solid fa-bell-slash"></i>
                                알림끄기
                            </div>
                            <div className="leave-chat-room" id="leave-room">
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                나가기
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default MidChat