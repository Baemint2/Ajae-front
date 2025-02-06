import React, {useEffect, useState} from "react";

const CreateChatRoomModal = () => {

    const [title, setTitle] = useState<string>("")
    const [inviteUsers, setInviteUsers] = useState<string[]>([])
    const [inviteUserInput, setInviteUserInput] = useState<string>("")

    useEffect(() => {
        if (inviteUserInput.trim()) {
            findUser(inviteUserInput);
        }
    }, [inviteUserInput]);

    const createChatRoom = () => {
        console.log(title);
    }

    const findUser = (username: string)=> {
        console.log("유저 찾기입니다.");
    }

    return (
        <div id="default-modal" tabIndex={-1} aria-hidden="true"
             className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div
                        className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            새로운 채팅방
                        </h3>
                        <button type="button"
                                className="gtext-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-hide="default-modal">
                            <svg className="w-3 h-3" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap={"round"}
                                      strokeLinejoin={"round"} strokeWidth={"2"}
                                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                        <form id="createChatRoomForm">
                            <div className="mb-3">
                                <label className="form-label">채팅방 제목</label>
                                <input type="text"
                                       className="form-control"
                                       onChange={(e) => setTitle(e.target.value)}
                                       id="chatRoomTitle" required/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">초대할 사용자</label>
                                <input type="text"
                                       className="form-control"
                                       id="create-inviteUser"
                                       onChange={(e) => setInviteUserInput(e.target.value)}
                                       placeholder="사용자 이름 또는 ID 검색"/>
                                <div id="selectedUserList"
                                     className="selected-user-list"></div>
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