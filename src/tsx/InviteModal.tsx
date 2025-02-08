import React, {useEffect, useState} from "react";
import anonymous from "../img/anonymous.png";

interface IUser {
    username: string;
    profile?: string;
    nickname: string;
}

interface InviteModalProps {
    isOpen: boolean,
    isClose: () => void
}

const InviteModal: React.FC<InviteModalProps> = ({
                                                             isOpen,
                                                             isClose
                                                         }) => {

    const [users, setUsers] = useState<IUser[]>([]);   // 사용자 목록
    const [title, setTitle] = useState<string>("")
    const [inviteUsers, setInviteUsers] = useState<Set<string>>(new Set())
    const [inviteUserInput, setInviteUserInput] = useState<string>("")

    useEffect(() => {
        if (inviteUserInput.trim()) {
            searchUsers(inviteUserInput);
        }
    }, [inviteUserInput]);

    useEffect(() => {
    }, [inviteUsers]);

    useEffect(() => {
    }, [users]);

    useEffect(() => {
        if (isOpen) {
            getUsers();
            setInviteUserInput("");  // 🔹 모달 열릴 때도 초기화
        } else {
            setInviteUsers(new Set());
            setInviteUserInput("");  // 🔹 모달 닫힐 때도 초기화
        }
    }, [isOpen]);

    const searchUsers = async (nickname: string) => {
        const response = await fetch(`http://localhost:8090/users/${nickname}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",

            }
        });
        const data = await response.json();
        console.log(data);
        setUsers(data)
    }

    const getUsers = () => {
        fetch("http://localhost:8090/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
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

    const handleInvite = (user: string) => {
        setInviteUsers(prevSet  => {
            const newSet = new Set(prevSet);
            newSet.delete(user);
            return newSet;
        })
        setInviteUserInput("");
    }

    return (
        <div id="invite-modal" tabIndex={-1} aria-hidden="true"
             className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
             style={{display: isOpen ? "flex" : "none"}}
        >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-white text-2xl">
                    <div
                        className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:bg-blue-400 border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            사용자 초대
                        </h3>
                        <button type="button"
                                onClick={isClose}
                                className="gtext-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900
                                rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center
                                dark:hover:bg-gray-600 dark:hover:text-white">
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
                             className="p-3 flex flex-wrap gap-2">
                            {[...inviteUsers].map((user) => (
                                <div className="border p-3 flex flex-row justify-between items-center rounded-xl h-14 w-50">
                                    <span className="text-2xl mr-5">{user}</span>
                                    <button className="end" onClick={() => handleInvite(user)}>x</button>
                                </div>
                            ))}
                        </div>
                        <form id="invite-form"
                              onSubmit={e => e.preventDefault()}
                        >
                            <div className="mb-3 flex flex-col text-2xl mt-4">
                                <input type="text"
                                       className="form-control mt-2 rounded-xl"
                                       id="create-inviteUser"
                                       onChange={(e) => setInviteUserInput(e.target.value)}
                                       value={inviteUserInput}
                                       placeholder="사용자 이름 또는 ID 검색"/>
                                <div className="user-list">
                                    {users.map((user) => (
                                        <div key={user.nickname} className="border p-2 my-2 flex flex-row items-center justify-between">
                                            <div className="flex items-center">
                                                <div className={"w-20"}><img src={anonymous} alt={'프로필사진'} /></div>
                                                <div className="ml-10">{user.nickname}</div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="mr-5 w-7 h-7"
                                                checked={inviteUsers.has(user.nickname)}
                                                onChange={() => {
                                                    setInviteUsers((prev) => {
                                                        const newSet = new Set(prev);
                                                        if (newSet.has(user.nickname)) {
                                                            newSet.delete(user.nickname); // 체크 해제 시 제거
                                                        } else {
                                                            newSet.add(user.nickname); // 체크 시 추가
                                                        }
                                                        return newSet;
                                                    });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button type="submit">초대</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InviteModal;