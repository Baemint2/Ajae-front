import React, { useState } from "react";

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

interface MessageItemProps {
    msg: Message;
    currentUserId: number;
    deleteMessage: (msgId: number, chatRoomNo: number) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ msg, currentUserId, deleteMessage }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleDelete = () => {
       console.log("삭제?")
    };

    return (
        <div className={`output ${msg.userId === currentUserId ? "sent" : "receive"}`} data-msg-no={msg.msgId}>
            {/* 프로필 이미지 */}
            {msg.userId !== currentUserId && (
                <div className="profile-image">
                    <img src={msg.empProfile || "/img/anonymous.png"} alt="Profile" />
                </div>
            )}

            {/* 메시지 내용 */}
            <div className={msg.msgStat === 1 || msg.msgStat === "DELETED" ? "deleted-chat" : "chat"}>
                {msg.msgStat === 1 || msg.msgStat === "DELETED" ? (
                    "삭제된 메시지입니다"
                ) : (
                    <pre>{msg.msgContent}</pre> // ✅ `<pre>` 태그로 줄바꿈 유지
                )}

                {/* 삭제 버튼 (본인 메시지인 경우만 표시) */}
                {msg.userId === currentUserId && (
                    <>
                        <i
                            className="fa-solid fa-ellipsis-vertical me-3"
                            onClick={() => setShowDropdown(!showDropdown)}
                        />
                        {showDropdown && (
                            <div className="chat-dropdown">
                                <li className="my-menu-item">
                                    <a className="chat-delete" onClick={handleDelete}>
                                        <i className="fa-solid fa-trash-can" style={{ color: "var(--main-color)" }}></i>
                                        <span style={{ color: "var(--main-color)" }}>삭제</span>
                                    </a>
                                </li>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* 메시지 시간 */}
            <div className="chat-datetime">
                {new Date(msg.msgDt).toLocaleTimeString("ko-KR", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                })}
            </div>
        </div>
    );
};

export default MessageItem;
