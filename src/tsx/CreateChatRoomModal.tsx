import React, {useEffect, useState} from "react";

interface CreateChatRoomModalProps {
    isOpen: boolean,
    isClose: () => void
}

const CreateChatRoomModal: React.FC<CreateChatRoomModalProps> = ({
                                                                     isOpen,
                                                                     isClose
                                                                 }) => {

    const [title, setTitle] = useState<string>("")
    const [inviteUsers, setInviteUsers] = useState<string[]>([])
    const [inviteUserInput, setInviteUserInput] = useState<string>("")

    useEffect(() => {
        if (inviteUserInput.trim()) {
            getUser(inviteUserInput);
        }
    }, [inviteUserInput]);

    useEffect(() => {
        if (isOpen) {
            console.log("유저 리스트를 가져옵니다.");
        }

    }, [isOpen]);

    const createChatRoom = () => {
        console.log(title);
    }

    const getUser = (username: string) => {
        console.log("유저 찾기입니다.");
    }

    return (
        <div id="default-modal" tabIndex={-1} aria-hidden="true"
             className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
             style={{display: isOpen ? "flex" : "none"}}>
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-blue-400 text-2xl">
                    <div
                        className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:bg-blue-400 border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            대화상대 선택
                        </h3>
                        <button type="button"
                                onClick={isClose}
                                className="gtext-gray-400 bg-transparent
                                hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap={"round"}
                                      strokeLinejoin={"round"} strokeWidth={"2"}
                                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                        <div id="selectedUserList"
                             className="selected-user-list"></div>
                        <form id="createChatRoomForm">
                            <div className="mb-3 flex flex-col text-2xl mt-4">
                                <input type="text"
                                       className="form-control mt-2 rounded-xl"
                                       id="create-inviteUser"
                                       onChange={(e) => setInviteUserInput(e.target.value)}
                                       placeholder="사용자 이름 또는 ID 검색"/>
                                <div className="user-list"></div>
                            </div>
                            <div id="userList" className="mb-3"></div>
                            <div className="btn-chat-create">
                                <button type="submit" className="btn btn-primary">생성</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateChatRoomModal