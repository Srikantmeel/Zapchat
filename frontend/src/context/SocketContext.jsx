import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const socket = io("http://localhost:5000", { // Ensure it matches your server URL
                query: {
                    userId: authUser._id,
                },
                transports: ['websocket', 'polling'], // Add transports to fallback to polling if websocket fails
            });

            setSocket(socket);

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            socket.on("connect_error", (err) => {
                console.error("Socket connection error: ", err);
            });

            socket.on("error", (err) => {
                console.error("Socket error: ", err);
            });

            socket.on("reconnect_error", (err) => {
                console.error("Socket reconnect error: ", err);
            });

            return () => {
                socket.close();
                setSocket(null);
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }

        return () => {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        };
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
