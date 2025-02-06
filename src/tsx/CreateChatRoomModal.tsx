import React, {useEffect, useState} from "react";
import anonymous from "../img/anonymous.png"

interface IUser {
    username: string;
    profile?: string;
    nickname: string;
    password: string;
}

interface CreateChatRoomModalProps {
    isOpen: boolean,
    isClose: () => void
}

const CreateChatRoomModal: React.FC<CreateChatRoomModalProps> = ({
                                                                     isOpen,
                                                                     isClose
                                                                 }) => {

    const [users, setUsers] = useState<IUser[]>([]);   // 사용자 목록
    const [title, setTitle] = useState<string>("")
    const [inviteUsers, setInviteUsers] = useState<Set<string>>(new Set())
    const [inviteUserInput, setInviteUserInput] = useState<string>("")

    useEffect(() => {
        if (inviteUserInput.trim()) {
            getUser(inviteUserInput);
        }
    }, [inviteUserInput]);


    useEffect(() => {
        if (isOpen) {
            getUsers();
            console.log("유저나오나욘")
        }

    }, [isOpen]);

    useEffect(() => {
        console.log(inviteUsers);
    }, [inviteUsers]);

    const createChatRoom = () => {
        console.log(title);
    }

    const getUser = (username: string) => {
        console.log("유저 찾기입니다.");
    }

    useEffect(() => {
        if (isOpen) {
            getUsers();
            console.log("유저나오나욘");
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setInviteUsers(new Set())
        }
    }, [isOpen]);

    const getUsers = () => {
        fetch("http://localhost:8090/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                // 꼭 return 해주어야 다음 then 에서 data를 받음
                return response.json();
            })
            .then((data) => {
                console.log(users)
                setUsers(data.users);
            })
            .catch((error) => {
                console.error("유저 불러오기 오류:", error);
            });
    };



    // @ts-ignore
    return (
        <div id="default-modal" tabIndex={-1} aria-hidden="true"
             className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
             style={{display: isOpen ? "flex" : "none"}}>
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-white text-2xl">
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
                        <div id="selectedUserList" className="mt-5 border p-3">
                            {[...inviteUsers].map((user) => (
                                <div>{user}</div>
                            ))}
                        </div>
                        <form id="createChatRoomForm">
                            <div className="mb-3 flex flex-col text-2xl mt-4">
                                <input type="text"
                                       className="form-control mt-2 rounded-xl"
                                       id="create-inviteUser"
                                       onChange={(e) => setInviteUserInput(e.target.value)}
                                       placeholder="사용자 이름 또는 ID 검색"/>
                                <div className="user-list">
                                    {users.map((user) => (
                                        <div key={user.nickname} className="border p-2 my-2 flex flex-row justify-between">
                                            <div className="flex items-center">
                                                <div className={"w-20"}><img src={anonymous} alt={'프로필사진'} /></div>
                                                <div className="ml-10">{user.nickname}</div>
                                            </div>
                                                <button
                                                    type="button"
                                                    className="mr-5"
                                                    onClick={() => setInviteUsers((prev) => new Set(prev).add(user.nickname))}
                                                >
                                                    초대
                                                </button>
                                        </div>
                                    ))}
                                </div>
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