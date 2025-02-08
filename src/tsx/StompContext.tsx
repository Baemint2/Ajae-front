import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface StompContextProps {
    stompClient: Client | null;
    isConnected: boolean;
}

const StompContext = createContext<StompContextProps | undefined>(undefined);

// ✅ STOMP Provider
export const StompProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8090/chat");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("✅ STOMP Connected!");
                setIsConnected(true);
            },
            onDisconnect: () => {
                console.log("❌ STOMP Disconnected!");
                setIsConnected(false);
            }
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
        };
    }, []);

    return (
        <StompContext.Provider value={{ stompClient, isConnected }}>
            {children}
        </StompContext.Provider>
    );
};

export const useStomp = () => {
    const context = useContext(StompContext);
    if (!context) {
        throw new Error("useStomp must be used within a StompProvider");
    }
    return context;
};
