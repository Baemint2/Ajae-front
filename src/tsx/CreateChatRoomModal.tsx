import React, {useEffect, useState} from "react";
import BaseModal from "./BaseModal";
import { UserInfo } from "./interface/userTypes";

interface CreateChatRoomModalProps {
    isOpen: boolean;
    isClose: () => void;
    modalTitle: string;
    userInfo?: UserInfo;
}

const CreateChatRoomModal: React.FC<CreateChatRoomModalProps> = ({
                                                                     isOpen,
                                                                     isClose,
                                                                     modalTitle,
                                                                     userInfo
                                                                 }) => {

    return (
        <BaseModal isOpen={isOpen} isClose={isClose}  modalTitle={modalTitle} userInfo={userInfo}/>
    )
}

export default CreateChatRoomModal